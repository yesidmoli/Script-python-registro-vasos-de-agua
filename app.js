const fs = require('fs');
const SESSION_FILE_PATH = './session.json';
const chalk = require('chalk');
const ora = require('ora');
const cors = require('cors');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const got = require('got');
const { Client, LocalAuth } = require('whatsapp-web.js');

let client;

//Database connection
mongoose.connect('mongodb://localhost:27017/botdrinkcups')
    .then(() => {
        console.log('connect db success');
    })
    .catch((e) => {
        console.log(`Don't connect db, error: ${e}`);
    });

// Create Schema DB for register option phone in flow
const optionPhoneSchema = new mongoose.Schema({
    phone: String,
    option: String
});

// Create Schema DB for register cups per user
const drinkCupSchema = new mongoose.Schema({
    phone: String,
    cupsnumber: Number,
    drinkon: Date
});

//Crear model database for option phone
const OptionPhone = mongoose.model('OptionPhone', optionPhoneSchema);

//Crear model database for drink cup
const DrinkCup = mongoose.model('DrinkCup', drinkCupSchema);
    

const listenMessage = () => {
    client.on('message', async msg => {
        const { from, to, body } = msg;
        await menuChat(from, body);
    });
}

const consultCups = async (from)=>{
    const lastOption = DrinkCup
        .find({ phone: from.replace('@c.us', '') }).exec(function(err, drinkCup) {
            if (err) throw err;
            try{
                cups = 0
                for (const element of drinkCup) {
                    cups = cups + element.cupsnumber
                    console.log(element.cupsnumber);
                  }
                totalDrinkCups = cups
                if (totalDrinkCups != 0){
                    message = 'Has bebido un total de *'+totalDrinkCups.toString()+'* *VASOS DE AGUA* 😉🥳🤩';
                }
                else{
                    message = '*No has bebido* un solo Vaso con agua 😟🙁😢... *EMPIEZA AHORA* colocando bot en el chat! 💪';
                }
                
            }
            catch{
                totalDrinkCups = null
                message = "Upss, tengo un error en mi codigo :s"
            }
            
            client.sendMessage(from, message);
        });
}


const register = async (from, lastOption, value) =>{
    if(lastOption == "1-1"){
        if(!isNaN(value)){
            const date = new Date();
            const dateAt = date.toISOString();
            const drinkCup = new DrinkCup({phone: from.replace('@c.us', ''), cupsnumber: value, drinkon:dateAt});
            drinkCup.save();
            message = 'Super!! *SIGUE ASI* 🚀';
            OptionPhone.deleteMany({phone:from}).exec();
            client.sendMessage(from, message);
        }else{
            message = 'Upss!! 😅, debes enviar un numero de vasos correcto 😁 \n Cuantos vasos de agua has tomado hoy: ';
            client.sendMessage(from, message);
        }
    }else{
        if(from.replace('@c.us', '') == "573052448292"){
            message = 'Hola *Erick*! 👋, Cuantos vasos de agua has tomado hoy:';
        }
        else if(from.replace('@c.us', '') == "573006843053"){
            message = 'Hola *Yesid*! 👋, Cuantos vasos de agua has tomado hoy:';
        }
        OptionPhone.deleteMany({phone:from, option:'1'}).exec();
        const optionPhone = new OptionPhone({phone: from, option: '1-1'});
        optionPhone.save();
        client.sendMessage(from, message);
    }
    
}

const menuChat = (from, answer) => new Promise((resolve, reject) => {

    const lastOption = OptionPhone
        .find({ phone: from }).sort({$natural:-1}).limit(1).exec(function(err, optionPhone) {
            if (err) throw err;
            try{
                lastOptionSelect = optionPhone[0].option;
            }
            catch{
                lastOptionSelect = null
            }
            console.log(lastOptionSelect, answer);

            if (lastOptionSelect == "1-1")
            {
                register(from, lastOptionSelect, answer)
            }else{
                if(answer == "Bot"){
                    message = 'Menu \n\n1)Registrar vasos de agua💧🥤\n2)Ver usuarios y numero de vasos 🔍\n3) Salir';
                    client.sendMessage(from, message);
                }
                else if(answer == "1" && lastOptionSelect == null){
                    const optionPhone = new OptionPhone({phone: from,option: '1'});
                    optionPhone.save();
                    register(from, lastOptionSelect, null)
                }
                else if (answer == "2"){
                    consultCups(from)
                }
                else if (answer == "3"){
                    (async () => {
                        const url = 'https://api.openai.com/v1/engines/davinci/completions';
                        const params = {
                          "prompt": "Escribir corto parrafo sobre los beneficios de beber agua",
                          "max_tokens": 160,
                          "temperature": 0.7,
                          "frequency_penalty": 0.5
                        };
                        const headers = {
                          'Authorization': ``,
                        };
                      
                        try {
                          const response = await got.post(url, { json: params, headers: headers }).json();
                          message = '*Recuerda que:* \n\n'+response.choices[0].text+'\n\n *Hasta pronto!!* 😇';
                          client.sendMessage(from, message);
                        } catch (err) {
                          console.log(err);
                          message = '*Hasta pronto!!* 😇 💧💦';
                          client.sendMessage(from, message);
                        }
                      })();
                    OptionPhone.deleteMany({phone:from}).exec();
                }
            }
    });
})

/**
 * Valida si existen session guardada del bot
 * Este paso permite omitir la generación y autenticación por QR CODE
 */
const withSession = () => {
    const spinner = ora(`Load ${chalk.yellow('Validating Whatsapp Session...')}`);
    spinner.start();

    client = new Client({
        authStrategy: new LocalAuth()
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        spinner.stop();
        connectionReady();

    });

    client.on('auth_failure', () => {
        spinner.stop();
        console.log('** Authentication error, regenerates the QRCODE (Delete the session.json file) **');
    })


    client.initialize();
}


/**
 * Permite generar codigo QR para inicializar una nueva sesión
 */
const withOutSession = () => {
    console.log('I don´t have session saved');
    client = new Client({
        authStrategy: new LocalAuth()
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        connectionReady();
    });

    client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE **');
    })

    client.initialize();
}

const connectionReady = () => {
    listenMessage();

}


(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();
