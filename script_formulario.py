
import time

#creacion de la variable para almacenar la informacion de los vasos de agua
vasos = { "yesid":0, "erick":0}

#creacion del menu
def menu():
    print("Menu")
    print("1) Registrar vasos de agua")
    print("2) Ver usuarios y numero de vasos")
    print("4) Salir")

    #seleccion de la opcion
    opcion = int(input("Elige una opcion: "))
    if opcion == 1:
        registrar()
    elif opcion == 2:
        ver()
    elif opcion == 3:
        exit()
    else:
        print("Opcion no valida")

#funcion para registrar los vasos de agua
def registrar():
    nombre = input("Ingresa tu nombre: ")
    numero_de_vasos = int(input("Cuantos vasos de agua has tomado hoy: "))

    #verificamos si el usuario ingresado existe
    if nombre in vasos:
        vasos[nombre] += numero_de_vasos
    else:
        print("nombre no valido, intentalo nuevamente")
    


    #mostramos el diccionario
    print("llevas registrados", vasos[nombre], "vasos de agua")
    print("Regresando al menu...")
    time.sleep(2)
    menu()



#funcion para ver los usuarios y el numero de vasos de agua 
def ver():
    for usuario, vasos_agua in vasos.items():
        print(f"Usuario: {usuario}")
        print(f"Vasos de agua: {vasos_agua}")
        
    print("Regresando al menu...")
    time.sleep(2)    
    menu()
menu()