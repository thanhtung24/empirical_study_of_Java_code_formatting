// Das Beispielexperiment erzeugt als Fragen nur die Zahlen 0-9.
// Ein Experimentteilnehmer kann die Zahlen 1-3 drücken
//
// Die Experimentdefinition erfolgt über Aufruf der Funktion
//  - document.experiment_definition(...)
// Falls eine Zufallszahl benötigt wird, erhält man sie durch den Methodenaufruf
//  - document.new_random_integer(...Obergrenze...);
//
// WICHTIG: Man sollte new_random_integer nur innerhalb  der Lambda-Funktion ausführen, also NICHT
// an einer anderen Stelle, damit man ein reproduzierbares Experiment erhält!
function generateCodes(format, methodNum, methodPosition) {
    let code = ""

    // Liste von Methodennamen erstellen
    const METHODNAME_LENGTH = 3
    const PREFIX = "create"
    const SUFFIX = "Number"

    let methodNames = []

    let mainMethodName = ""
    let mainMethodStrings = []
    for(let i = 0; i < METHODNAME_LENGTH; i++) {
        let string = capitalizeFirstLetter(getRandomElement(nouns))
        mainMethodStrings.push(string)
        mainMethodName += string
    }

    mainMethodName = `${PREFIX}${mainMethodName}${SUFFIX}`

    if(methodPosition == 0) {
        while (methodNames.length < methodNum) {
            let newMethodName = createMethodNameDiffFromMainMethodTask6(PREFIX, mainMethodStrings, SUFFIX)
            if(!methodNames.includes(newMethodName)) {
                methodNames.push(newMethodName)
            }
        }
    } else {
        while (methodNames.length < methodNum - 1) {
            let newMethodName = createMethodNameDiffFromMainMethodTask6(PREFIX, mainMethodStrings, SUFFIX)
            if(!methodNames.includes(newMethodName)) {
                methodNames.push(newMethodName)
            }
        }

        if(methodPosition != 0) {
            // die Position der main-Methode bestimmen
            methodNames.splice(methodPosition - 1, 0, mainMethodName);
        }
    }

    // Printen
    code += " ".repeat(80)
    code += `Gesuchte Methode: ${mainMethodName}\n`
    code += "\n\n\n"

    let methodCounter = 1
    for(let name of methodNames) {
        let newCode = generateCode(format, getParameterList(3), name)
        code += `${methodCounter}.\n${newCode}\n\n`
        methodCounter++
    }

    return code
}

function generateCode(format, parameterList, methodName) {
    let methodScope = getRandomElement(["public", "private", "protected"])
    let methodReturnType = ""

    // Zufällige Längen der Rückgabetypen
    let rn = getRandomNumber(1, 4);
    for(let i = 0; i < rn; i++) {
        methodReturnType += capitalizeFirstLetter(getRandomElement(nouns))
    }

    let code = ""

    if(format == STANDARD_FORMAT) {
        // Statements
        let statements = createStatementsWithoutParameterlist(3)

        code += `${methodScope} ${methodReturnType} ${methodName} (`

        // Parameter list
        for(let i = 0; i < parameterList.length; i++) {
            if (i == parameterList.length - 1) {
                code += `${parameterList[i]}) {\n`
            } else {
                code += `${parameterList[i]}, `
            }
        }

        // Method body
        for(let i = 0; i < statements.length; i++) {
            code += `${TAB}${statements[i]};\n`
        }

        code += "}"
    } else if (format == SPECIAL_FORMAT) {
        // Statements
        let statements = createStatementsWithoutParameterlist(3)

        let methodSignature = `${methodScope} ${methodReturnType} ${methodName} (`
        code += `${methodSignature}\n`

        // Parameter list
        let indentationForParameterList = " ".repeat(methodSignature.length)
        let lastLineOfParameterListLength = ""
        let maxLineLengthOfParameterlist = 0

        for(let i = 0; i < parameterList.length; i++) {
            let parameterName = parameterList[i].split(" ")[1]
            let parameterType = parameterList[i].split(" ")[0]
            let indentation = getIndentationForParameterOfSpecialFormat(parameterList, parameterList[i])

            if(parameterList[i].length + indentation.length > maxLineLengthOfParameterlist) {
                maxLineLengthOfParameterlist = parameterList[i].length + indentation.length
            }

            if (i == parameterList.length - 1) {
                let indentationForClosingBracket = " ".repeat(maxLineLengthOfParameterlist - (parameterList[i].length + indentation.length))

                let lastLineOfParameterList = `${indentationForParameterList}${parameterType}${indentation} ${parameterName}${indentationForClosingBracket}) {\n`
                lastLineOfParameterListLength = " ".repeat(lastLineOfParameterList.length)
                code += lastLineOfParameterList
            } else {
                code += `${indentationForParameterList}${parameterType}${indentation} ${parameterName},\n`
            }
        }

        // Method body
        let indentationForMethodBody = lastLineOfParameterListLength
        for(let i = 0; i < statements.length; i++) {
            if (i == statements.length -1) {
                code += `${indentationForMethodBody}${statements[i]};}`
            } else {
                code += `${indentationForMethodBody}${statements[i]};\n`
            }

        }
    } else {
        // Statements
        let statements = createStatementsWithoutParameterlist(3)

        let methodSignature = `${methodScope} ${methodReturnType} ${methodName} (`
        code += `${methodSignature}\n`

        // Parameter list
        let indentationForParameterList = " ".repeat(methodSignature.length)
        let lastLineOfParameterListLength = ""
        let maxLineLengthOfParameterlist = 0

        for(let i = 0; i < parameterList.length; i++) {
            let parameterName = parameterList[i].split(" ")[1]
            let parameterType = parameterList[i].split(" ")[0]
            let indentation = getIndentationForParameterOfSpecialFormat(parameterList, parameterList[i])

            if(parameterList[i].length + indentation.length > maxLineLengthOfParameterlist) {
                maxLineLengthOfParameterlist = parameterList[i].length + indentation.length
            }

            if (i == parameterList.length - 1) {
                let indentationForClosingBracket = " ".repeat(maxLineLengthOfParameterlist - (parameterList[i].length + indentation.length))

                let lastLineOfParameterList = `${indentationForParameterList}${parameterType}${indentation} ${parameterName}${indentationForClosingBracket})\n`
                lastLineOfParameterListLength = " ".repeat(lastLineOfParameterList.length)
                code += lastLineOfParameterList
            } else {
                code += `${indentationForParameterList}${parameterType}${indentation} ${parameterName},\n`
            }
        }

        // Method body
        code += " ".repeat(methodScope.length) + "{\n"
        let indentationForMethodBody = " ".repeat(methodScope.length + 1)
        for(let i = 0; i < statements.length; i++) {
            code += `${indentationForMethodBody}${statements[i]};\n`
        }
        code += " ".repeat(methodScope.length) + "}\n"
    }

    return code
}

function getParameterList(parameterNum) {
    let parameterList = []
    let parameterNames = getRandomElements(nouns, parameterNum)

    for(let name of parameterNames) {
        parameterList.push(`${capitalizeFirstLetter(getRandomElement(nouns))} ${name}`)
    }

    return parameterList
}

function createMethodNameDiffFromMainMethodTask6(prefix, strings, suffix) {
    let methodName = ""
    let num = getRandomNumber(0, strings.length - 1)

    for(let i = 0; i < strings.length; i++) {
        let newString = ""
        if(i == num) {
            while(newString == "" || newString == strings[num]) {
                newString = capitalizeFirstLetter(getRandomElement(nouns))
            }
        } else {
            newString = strings[i]
        }

        methodName += newString
    }

    return `${prefix}${methodName}${suffix}`
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Finden einer Methode",
        seed: "42",
        introduction_pages: [getIntroduction()],
        pre_run_instruction: getPreRunInstruction(),
        finish_pages: [getFinishPages()],
        layout: [
            { variable: "Formatierung", treatments: ["Standardformatierung", "Alternative Formatierung", "Optimierte Formatierung"]},
            { variable: "Anzahl an Methoden", treatments: [9]},
            { variable: "Position der gesuchten Methode", treatments: ["Gruppe 1", "Gruppe 2", "Gruppe 3"]}
        ],
        repetitions: 3,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration: (t) => {
            // Das hier ist der Code, der jeder Task im Experiment den Code zuweist.
            // Im Feld code steht der Quellcode, der angezeigt wird,
            // in "expected_answer" das, was die Aufgabe als Lösung erachtet
            // In das Feld "given_answer" trägt das Experiment ein, welche Taste gedrückt wurde
            //
            // Ein Task-Objekt hat ein Feld treatment_combination, welches ein Array von Treatment-Objekten ist.
            // Ein Treatment-Objekt hat zwei Felder:
            //     variable - Ein Variable-Objekt, welches das Feld name hat (der Name der Variablen);
            //     value - Ein String, in dem der Wert des Treatments steht.

            let methodNum = t.treatment_combination[1].value;

            if(t.treatment_combination[2].value == "Gruppe 1") {
                t.expected_answer = getRandomNumber(1, 3)
            } else if(t.treatment_combination[2].value == "Gruppe 2") {
                t.expected_answer = getRandomNumber(4, 6)
            } else if(t.treatment_combination[2].value == "Gruppe 3") {
                t.expected_answer = getRandomNumber(7, 9)
            }

            if(t.treatment_combination[0].value == STANDARD_FORMAT) {
                t.code = generateCodes(STANDARD_FORMAT, methodNum, t.expected_answer)
            } else if(t.treatment_combination[0].value == SPECIAL_FORMAT) {
                t.code = generateCodes(SPECIAL_FORMAT, methodNum, t.expected_answer)
            } else {
                t.code = generateCodes(OPTIMIZED_SPECIAL_FORMAT, methodNum, t.expected_answer)
            }

            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            let afterTaskStringHinweis = "\n\nLegen Sie eine Pause ein, falls nötig.\nDrücken Sie [Enter], um zur nächsten Frage zu gelangen (scrollen Sie vor dem Drücken von [Enter] ganz nach oben!)."
            t.after_task_string = () => "Eingegebene Antwort: " + t.given_answer + " - Richtige Antwort: " + t.expected_answer + afterTaskStringHinweis;
        }
    }
);

function getFinishPages() {
    return "Vielen Dank für Ihre Teilnahme! Drücken Sie [Enter], um die Daten des Experiments herunterzuladen.\n\nBitte ändern Sie den Dateinamen nicht und senden Sie die Datei anschließend an die E-Mail-Adresse thanh.pham.tung2412000@stud.uni-due.de"
}

function getPreRunInstruction() {
    return "Machen Sie sich bereit. Verwenden Sie die Zahlentasten von [1] bis [9], um Ihre Antworten einzugeben.\n\nDrück Sie jetzt [Enter], um die erste Frage zu öffnen"
}

function getIntroduction() {
    return "Vielen Dank für Ihre Teilnahme!\n" +
        "\n" +
        "Wir freuen uns, dass Sie Teil dieser empirischen Untersuchung sind. " +
        "\n" +
        "Ihre Teilnahme trägt maßgeblich dazu bei, unser Verständnis für die Evaluation unterschiedlicher Quelltextformatierungen in Java durch kontrollierte Experimente zu vertiefen.\n" +
        "\n" +
        "Bitte lesen Sie die folgenden Informationen sorgfältig durch, um sich mit dem Ablauf und den Anforderungen des Experiments vertraut zu machen. " +
        "\n" +
        "Ihre Antworten und Daten werden streng vertraulich behandelt und ausschließlich für wissenschaftliche Zwecke genutzt." +
        "\n" + "-".repeat(300) +
        "\n" + "\n" +
        getHinweise() +
        "\n" + "-".repeat(300) +
        "\n" + "\n" +
        getBeispielAufgabe() +
        "\n" + "-".repeat(300) +
        "\n" + "\n" +
        getZusaetzlicheHinweise()
}

function getHinweise() {
    return "Wichtige Hinweise\n" +
        "  " +
        "- Dauer des Experiments: ca. 4 Minuten (ohne Trainingszeit).\n" +
        "  " +
        "- Training: Es wird dringend empfohlen, vor Beginn des eigentlichen Experiments das Training durchzuführen, um sich mit der Aufgabe vertraut zu machen. Stellen Sie sicher, dass Ihnen die Aufgabenstellung vollständig klar ist, bevor Sie starten."
}

function getBeispielAufgabe() {
    return "Beispielaufgabe:\n" +
        "\n" +
        "Ihnen werden mehrere Methoden angezeigt, deren Logik für diese Aufgabe irrelevant ist. Ihre Aufgabe besteht darin, die gesuchte Methode anhand des angegebenen Methodennamens zu identifizieren. Die Parameterliste ist dabei nicht von Bedeutung.\n" +
        "\n" +
        "Beispiel: Gesuchte Methode: createPerceptionRevolutionUniversityNumber\n" +
        "\n" +
        "1.\n" +
        "public VolcanoGuitarSubmarine createOceanRevolutionUniversityNumber (Development negotiation, Equation celebration, Underwater frequency) {\n" +
        "  this.removeSymphony(landscape, generation, volcano, architecture);\n" +
        "  compass = bacteria.setManagement(perception, author);\n" +
        "  economics = ecosystem.getContributor(architecture, oxygen);\n" +
        "}\n" +
        "\n" +
        "2.\n" +
        "protected LaboratoryRecipeFormula createPerceptionBeachfrontUniversityNumber (Bacteria investment, Wilderness appreciate, Expression underwater) {\n" +
        "  changeDolphin(culture, removeExplorer(heritage, memory), motivation);\n" +
        "  applyConstellation(university, removePlanetary(transformed, cooperation), imagination);\n" +
        "  this.changeSediment(predator, investment, particle, vacuum);\n" +
        "}\n" +
        "\n" +
        "3.\n" +
        "protected TransmittedTransformedFrequency createPerceptionRevolutionUniversityNumber (Blueprint appreciate, Specialized tropical, Piano ecosystem) {\n" +
        "  negotiation = changeSpecialized(submarine).removeMemory(sediment).setConstellation(element);\n" +
        "  cyclone = predator.getLaboratory(heritage, revolution);\n" +
        "  progression = sandstorm.updateSymphony(landscape, rocket);\n" +
        "}"+
        "\n" + "\n" +
        "Die 3. Methode hat den richtigen Methodenname und ist daher die gesuchte Methode.\n" +
        "Sie können Ihre Antwort eingeben, indem Sie die entsprechende Zahlentaste [3] drücken.\n" +
        "Um zur nächsten Frage zu gelangen, drücken Sie [Enter]."
}

function getZusaetzlicheHinweise() {
    return "Zusätzliche Hinweise:\n" +
        "- Sie können zwischen den Fragen Pausen einlegen, falls nötig.\n" +
        "- Das Experiment endet, wenn alle Fragen beantwortet wurden. Am Ende wird automatisch eine CSV-Datei heruntergeladen. Bitte ändern Sie den Dateinamen nicht!\n" +
        "\n" +
        "Vielen Dank für Ihre Unterstützung! Wenn Sie bereit sind, drücken Sie auf [Enter], um zu starten."
}

