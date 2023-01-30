#add the time library
import time

#creation of the variable to store the information of the glasses of water
cups = { "yesid":0, "erick":0}

#menu creation
def menu():
    print("Menu")
    print("1) Record glasses of water")
    print("2) See users and number of glasses")
    print("3) Go out")

    #selection of the option
    option = int(input("Choose an option: "))
    if option == 1:
        register()
    elif option == 2:
        view()
    elif option == 3:
        exit()
    else:
        print("Option not valid")

#function to register the glasses of water
def register():
    name = input("Enter your name: ")
    number_cups= int(input("How many glasses of water have you had today?: "))

    # check if the entered user exists
    if name in cups:
        cups[name] += number_cups
    else:
        print("Invalid name, try again")
    


    # show the dictionary
    print("you have registered", cups[name], "cups of water")
    print("Returning to the menu...")
    time.sleep(2)
    menu()



#function to see the users and the number of glasses of water
def view():
    for Username, cups_water in cups.items():
        print(f"Usuario: {Username}")
        print(f"Vasos de agua: {cups_water}")
        
    print("Returning to the menu...")
    time.sleep(2)    
    menu()
menu()