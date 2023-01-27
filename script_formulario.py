#add the time library
import time

#creation of the variable to store the information of the glasses of water
vasos = { "yesid":0, "erick":0}

#menu creation
def menu():
    print("Menu")
    print("1) Registrar vasos de agua")
    print("2) Ver usuarios y numero de vasos")
    print("4) Salir")

    #selection of the option
    opcion = int(input("Elige una opcion: "))
    if opcion == 1:
        registrar()
    elif opcion == 2:
        ver()
    elif opcion == 3:
        exit()
    else:
        print("Opcion no valida")

#function to register the glasses of water
def registrar():
    nombre = input("Ingresa tu nombre: ")
    numero_de_vasos = int(input("Cuantos vasos de agua has tomado hoy: "))

    # check if the entered user exists
    if nombre in vasos:
        vasos[nombre] += numero_de_vasos
    else:
        print("nombre no valido, intentalo nuevamente")
    


    # show the dictionary
    print("llevas registrados", vasos[nombre], "vasos de agua")
    print("Regresando al menu...")
    time.sleep(2)
    menu()



#function to see the users and the number of glasses of water
def ver():
    for usuario, vasos_agua in vasos.items():
        print(f"Usuario: {usuario}")
        print(f"Vasos de agua: {vasos_agua}")
        
    print("Regresando al menu...")
    time.sleep(2)    
    menu()
menu()