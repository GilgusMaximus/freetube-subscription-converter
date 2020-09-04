const fs = require('fs')
let oldDBPath = null
let newDBPath = null
let assignToOldProfiles = false

function generateId(length) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for(let i = 0; i < length; i++){
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return result
}

function readJsonDataFromFile(filePath) {
    const options ={
        encoding: 'utf-8'
    }

    const fileData = fs.readFileSync(filePath, options).split('\n')
    const fileJSONData = []
    fileData.forEach((line) => {
        if (line === '') {
            return
        }
        fileJSONData.push(JSON.parse(line))
    })
    return fileJSONData
}

function appendOldTubeToFile(oldTubeProfile){
    fs.appendFile(newDBPath, JSON.stringify(oldTubeProfile), (err) => {
        if (err) throw err;
        console.log('Saved!');
    });

}

function addOldTube(oldJSONData) {
    const newProfile = {
        name: 'oldTube',
        bgColor: '#C51162',
        textColor: '#FFFFFF',
        subscriptions: [],
        _id: generateId(16)
    }
    oldJSONData.forEach((jsonLine) => {
        newProfile.subscriptions.push({
            id: jsonLine.channelId,
            name: jsonLine.channelName,
            thumbnail: jsonLine.channelThumbnail
        })
    })
    appendOldTubeToFile(newProfile)
}

function addToOldProfiles(oldJson, newJson) {
    const newJsonProfiles = []
    // add the profile to the array
    newJson.forEach((profile) => {
        newJsonProfiles.push(profile.name)
    })
    oldJson.forEach((channel) => {
        const channelObject = {
            id: channel.channelId,
            name: channel.channelName,
            thumbnail: channel.channelThumbnail
        }
        channel.profile.forEach((profilePart) => {
            const indexOfProfile = newJsonProfiles.indexOf(profilePart.value)
            if (indexOfProfile > -1) {
                newJson[indexOfProfile].subscriptions.push(channelObject)
            } else {
                newJsonProfiles.push(profilePart.value)
                newJson.push({
                    name: profilePart.value,
                    bgColor: '#C51162',
                    textColor: '#FFFFFF',
                    subscriptions: [],
                    _id: generateId(16)
                })
                newJson[newJson.length-1].subscriptions.push(channelObject)
            }
        })
    })
    writeNewJSONToFile(newJson)
}

function writeNewJSONToFile(newJson){
    fs.writeFileSync(newDBPath, JSON.stringify(newJson[0])+'\n', (err) => {
        if (err) throw err;
        console.log('Saved!');
    });
    newJson.shift()
    newJson.forEach((profile) => {
        fs.appendFileSync(newDBPath, JSON.stringify(profile)+'\n', (err) => {
            if (err) throw err;
            console.log('Saved!');
        });
    })
    console.log('Saved!');
}

const arguments = process.argv
if (arguments[2] === '-op') {
    oldDBPath = arguments[3]
} else {
    console.error('Missing -op `pathToOldDbFile` as first argument')
    return
}
if (arguments[4] === '-np') {
    newDBPath = arguments[5]
} else {
    console.error('Missing -np `pathToNewDbFile` as second argument')
    return
}
if (arguments.length === 7 && arguments[6] === '-t') {
    assignToOldProfiles = true
}

oldFileJSON = readJsonDataFromFile(oldDBPath)
newFileJSON = readJsonDataFromFile(newDBPath)

if (assignToOldProfiles) {
    addToOldProfiles(oldFileJSON, newFileJSON)
} else {
    addOldTube(oldFileJSON)
}
