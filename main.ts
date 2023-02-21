serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialLineReceived = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    commandParts = serialLineReceived.split(" ")
    command = commandParts[0]
    if (command == "heart") {
        basic.showIcon(IconNames.Heart)
    } else if (command == "diamond") {
        basic.showIcon(IconNames.Diamond)
    } else if (command == "square") {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else if (command == "sensitivity") {
        if (commandParts.length > 1) {
            sensitivity = parseInt(commandParts[1])
        }
    } else {
        basic.showString(command)
    }
})
let command = ""
let commandParts: string[] = []
let serialLineReceived = ""
let sensitivity = 0
sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})
