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
function generateCode(format, parameterNum, notUsedParameterNum) {
    let methodScope = getRandomElement(["public", "private", "protected"])
    let methodReturnType = capitalizeFirstLetter(getRandomElement(nouns))
    let methodName = createMethodName()
    let parameterList = getParameterList(parameterNum)
    let statements = createStatements(parameterList.map(p => p.split(" ")[1]), notUsedParameterNum)

    let code = ""

    if(format == STANDARD_FORMAT) {
        code += `${methodScope} ${methodReturnType} ${methodName} (`
        
        // Parameter list
        for(let i = 0; i < parameterList.length; i++) {
            if (i == parameterList.length -1) {
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
    } else if(format == SPECIAL_FORMAT) {
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
    let parameterNames = []

    while(parameterNames.length < parameterNum) {
        let parameterName = createIdentifier(nouns)
        if(!parameterNames.includes(parameterName)) {
            parameterNames.push(parameterName)
        }
    }

    for(let name of parameterNames) {
        parameterList.push(`${capitalizeFirstLetter(createIdentifier(nouns))} ${name}`)
    }

    return parameterList
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Zählen der Nicht-Methodenparameter",
        seed: "42",
        introduction_pages: [getIntroduction()],
        pre_run_instruction: getPreRunInstruction(),
        finish_pages: [getFinishPages()],
        layout: [
            { variable: "Formatierung", treatments: ["Standardformatierung", "Alternative Formatierung", "Optimierte Formatierung"]},
            { variable: "Anzahl der Nicht-Methodenparameter", treatments: ["Gruppe 1", "Gruppe 2"]}
        ],
        repetitions: 3,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["1", "2", "3"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
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

            t.expected_answer = t.treatment_combination[1].value;
            let parameterNum = 5

            if(t.treatment_combination[1].value == "Gruppe 1") {
                t.expected_answer = getRandomNumber(1, 2)
            } else if(t.treatment_combination[1].value == "Gruppe 2") {
                t.expected_answer = 3
            }

            if(t.treatment_combination[0].value == STANDARD_FORMAT) {
                t.code = generateCode(STANDARD_FORMAT, parameterNum, t.expected_answer)
            } else if(t.treatment_combination[0].value == SPECIAL_FORMAT) {
                t.code = generateCode(SPECIAL_FORMAT, parameterNum, t.expected_answer)
            } else {
                t.code = generateCode(OPTIMIZED_SPECIAL_FORMAT, parameterNum, t.expected_answer)
            }

            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            let afterTaskStringHinweis = "\n\nLegen Sie eine Pause ein, falls nötig.\nDrücken Sie [Enter], um zur nächsten Frage zu gelangen."
            t.after_task_string = () => "Eingegebene Antwort: " + t.given_answer + " - Richtige Antwort: " + t.expected_answer + afterTaskStringHinweis
        }
    }
);


function getFinishPages() {
    return "Vielen Dank für Ihre Teilnahme! Drücken Sie [Enter], um die Daten des Experiments herunterzuladen.\n\nBitte ändern Sie den Dateinamen nicht und senden Sie die Datei anschließend an die E-Mail-Adresse thanh.pham.tung2412000@stud.uni-due.de"
}

function getPreRunInstruction() {
    return "Machen Sie sich bereit. Verwenden Sie die Zahlentasten [1], [2], [3], um Ihre Antworten einzugeben.\n\nDrück Sie jetzt [Enter], um die erste Frage zu öffnen"
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
        "- Dauer des Experiments: ca. 5 Minuten (ohne Trainingszeit).\n" +
        "  " +
        "- Training: Es wird dringend empfohlen, vor Beginn des eigentlichen Experiments das Training durchzuführen, um sich mit der Aufgabe vertraut zu machen. Stellen Sie sicher, dass Ihnen die Aufgabenstellung vollständig klar ist, bevor Sie starten."
}

function getBeispielAufgabe() {
    return "Beispielaufgabe:\n" +
        "Es wird Ihnen eine Methode angezeigt, deren Logik für diese Aufgabe keine Rolle spielt.\nIhre Aufgabe ist es, die Anzahl der im Methodenkörper verwendeten Variablen zu bestimmen, die nicht in der Parameterliste zu finden sind." +
        "\n\n" +
        "public Economics setLeadership (Landscape planet, Objectives research, Cityscape sociology, Satellite recipe, Algorithm tropical) {\n" +
        "  recipe = research.updateCooperation(guitar, rainforest);\n" +
        "  this.createNeuron(planet, specialized, research, sociology);\n" +
        "  tropical.updateSubmarine(tropical, tropical, planet);\n" +
        "}"+
        "\n" + "\n" +
        "Im Methodenkörper gibt es die drei Variablen 'guitar', 'rainforest' und 'specialized', die nicht Parameter der Methoden sind. Also ist '3' die richtig Antwort \n\n" +
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

