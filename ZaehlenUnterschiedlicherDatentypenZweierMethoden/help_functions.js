const nouns = [
    "planet", "innovation", "guitar", "recipe", "tornado", "biology", "culture", "whale", "rocket", "philosophy",
    "memory", "conductor", "piano", "explorer", "galaxy", "element", "symphony", "universe", "theorem", "horizon",
    "ocean", "rainforest", "atmosphere", "particle", "galaxy", "mountain", "ecosystem", "blueprint", "constellation",
    "planetarium", "algorithm", "ceremony", "architect", "vacuum", "satellite", "planet", "author", "compass",
    "language", "microphone", "violin", "telescope", "bacterium", "astronomy", "potion", "equation", "philosopher",
    "robot", "neuron", "framework", "galaxy", "formula", "pyramid", "submarine", "volcano", "asteroid", "sandstorm",
    "heritage", "pyramid", "climate", "theory", "dolphin", "painter", "landscape", "cityscape", "constellation",
    "spectrum", "gravity", "ecosystem", "whirlpool", "avalanche", "cyclone", "civilization", "beachfront", "architecture",
    "oxygen", "laboratory", "nebulous", "photon", "fusion", "planetary", "predator", "sediment", "frequency", "bacteria",
    "revolution", "vaccine", "attraction", "voyage", "economics", "sociology", "memory", "monument", "museum", "volcano",
    "radiation", "blueprint", "calculator", "education", "laboratory", "research", "tropical", "underwater", "jungle",
    "appreciate", "celebration", "controlling", "determined", "expression", "government", "importance", "leadership", "networking",
    "objectives", "perception", "questioning", "reasonable", "technology", "understand", "validation", "wonderfully", "achievement",
    "cooperation", "contributor", "development", "experience", "foundation", "generation", "hierarchies", "imagination", "inspiration",
    "investment", "leaderships", "legislation", "management", "motivation", "negotiation", "observation", "partnership", "progression",
    "publishing", "reputation", "satisfaction", "situational", "specialized", "stimulation", "supervision", "transformed",
    "transmitted", "university", "visibility", "wilderness", "worthwhile", "yesteryears"
];

const STANDARD_FORMAT = "Standard format"
const SPECIAL_FORMAT = "Special format"
const OPTIMIZED_SPECIAL_FORMAT = "Optimized special format"
const TAB = "  "
const IDENTIFIER_LENGTH_PARAMETERLIST = 1
const IDENTIFIER_LENGTH_BODY = 1

//--- FOR THE CODE -----------------------------------------------------------
function createIdentifier(arr) {
    let identifier = ""

    for(let i = 0; i < IDENTIFIER_LENGTH_PARAMETERLIST; i++) {
        if(i == 0) {
            identifier += getRandomElement(arr)
        } else {
            identifier += capitalizeFirstLetter(getRandomElement(arr))
        }
    }

    return identifier
}

function createStatements(parameterList, notUsedParameterNum) {
    let statementNum = 3
    let statements = []
    let notUsedParameters = new Map()

    while(notUsedParameters.size < notUsedParameterNum) {
        let element = createIdentifier(nouns);
        if(!parameterList.includes(element) && !isElementInMap(notUsedParameters, element)) {
            let index = getRandomNumber(0, statementNum * 2);
            if(!notUsedParameters.has(index)) {
                notUsedParameters.set(index, element)
            }
        }
    }

    let paramPosition = 0
    for(let i = 0; i < statementNum; i++) {
        let variables = []

        while(variables.length < 4) {
            if(notUsedParameters.has(paramPosition)) {
                variables.push(notUsedParameters.get(paramPosition))
                paramPosition++
            } else {
                variables.push(getRandomElement(parameterList))
                paramPosition++
            }
        }

        statements.push(createRandomStatement(variables))
    }

    return statements
}

function createStatementsWithoutParameterlist(statementNum) {
    let statements = []

    for(let i = 0; i < statementNum; i++) {
        statements.push(createRandomStatement())
    }

    return statements
}

function createRandomStatement(variables) {
    return createStatement(getRandomNumber(1, 5), variables)
}

function createStatement(statementNumber, variables) {
    let variablesToUse = []
    while (variablesToUse.length < 4) {
        let variable = ""

        for(let i = 0; i < IDENTIFIER_LENGTH_BODY; i++) {
            variable += getRandomElement(nouns)
        }

        if(!variablesToUse.includes(variable)) {
            variablesToUse.push(variable)
        }
    }

    if(variables != undefined) {
        if(variables[0].includes(" ")) {
            variables.map(p => p.split(" ")[1])
        } else {
            variablesToUse = variables
        }
    }

    switch (statementNumber) {
        case 1:
            return `${variablesToUse[0]} = ${variablesToUse[1]}.${createMethodName()}(${variablesToUse[2]}, ${variablesToUse[3]})`
        case 2:
            return `this.${createMethodName()}(${variablesToUse[0]}, ${variablesToUse[1]}, ${variablesToUse[2]}, ${variablesToUse[3]})`
        case 3:
            return `${createMethodName()}(${variablesToUse[0]}, ${createMethodName()}(${variablesToUse[1]}, ${variablesToUse[2]}), ${variablesToUse[3]})`
        case 4:
            return `${variablesToUse[0]} = ${createMethodName()}(${variablesToUse[1]}).${createMethodName()}(${variablesToUse[2]}).${createMethodName()}(${variablesToUse[3]})`
        case 5:
            return `${variablesToUse[0]}.${createMethodName()}(${variablesToUse[1]}, ${variablesToUse[2]}, ${variablesToUse[3]})`
    }
}

function createMethodName() {
    const prefix = ["create", "get", "set", "add", "apply", "remove", "change", "update"]
    return getRandomElement(prefix) + capitalizeFirstLetter(createIdentifier(nouns))
}

function getIndentationForParameterOfSpecialFormat(parameterList, parameter) {
    let parameterTypes = parameterList.map(p => p.split(" ")[0])
    let maxLength = 0

    for(let type of parameterTypes) {
        if(type.length > maxLength) {
            maxLength = type.length
        }
    }

    return " ".repeat(maxLength - parameter.split(" ")[0].length)
}

//--- GENERAL -----------------------------------------------------------------
function getRandomIdentifiers(count) {
    let identifiers = []
    while(identifiers.length < count) {
        let identifier = createIdentifier(nouns);
        if(!identifiers.includes(identifier)) {
            identifiers.push(identifier)
        }
    }

    return identifiers
}

function getRandomElements(arr, count) {
    if (arr.length === 0 || count <= 0) {
        return [];
    }

    const result = [];

    while (result.length < count) {
        let newElement = getRandomElement(arr)
        if(!result.includes(newElement)) {
            result.push(newElement)
        }
    }

    return result;
}

function getRandomElement(arr) {
    if (arr.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalizeFirstLetter(str) {
    if (str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Zufälliger Index von 0 bis i
        [array[i], array[j]] = [array[j], array[i]];   // Elemente tauschen
    }
    return array;
}

function isElementInMap(map, element) {
    for(let el of map.values()) {
        if (el === element) {
            return true
        }
    }
    return false
}
