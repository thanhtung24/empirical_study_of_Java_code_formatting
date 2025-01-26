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

const IDENTIFIER_LENGTH = 4
function generateCodes(format, parameterNum, usedMethodNum) {
    const STATEMENT_NUM = 2
    const HELP_METHOD_NUM = 3

    let calledMethods = []
    let helpMethods = []

    let mainMethod = ""
    let code = ""

    while (calledMethods.length < STATEMENT_NUM * 4) {
        let methodName = createMethodName()
        if(!calledMethods.includes(methodName)) {
            calledMethods.push(methodName)
        }
    }

    let usedMethods = getRandomElements(calledMethods, usedMethodNum)
    for(let method of usedMethods) {
        helpMethods.push(method)
    }

    while(helpMethods.length < HELP_METHOD_NUM) {
        let method = createMethodName()
        if(!helpMethods.includes(method)) {
            helpMethods.push(method)
        }
    }

    shuffleArray(helpMethods)

    while(mainMethod == "" || helpMethods.includes(mainMethod)) {
        mainMethod = createMethodName()
    }

    let code1 = generateMainCodeTask5(format, STATEMENT_NUM, calledMethods, mainMethod)
    code += code1 + "\n\n"

    for(let i = 0; i < HELP_METHOD_NUM; i++) {
        let newCode = generateCodeWithoutParameterlist(format, helpMethods[i])
        code += `${newCode}\n\n`
    }

    return `${code}`
}

function createMethodName() {
    const prefix = ["create", "get", "set", "add", "apply", "remove", "change", "update"]
    return getRandomElement(prefix) + capitalizeFirstLetter(createIdentifier(nouns))
}

function getRandomElement(arr) {
    if (arr.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function capitalizeFirstLetter(str) {
    if (str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function createIdentifier(arr) {
    let identifier = ""

    for(let i = 0; i < IDENTIFIER_LENGTH; i++) {
        if(i == 0) {
            identifier += getRandomElement(arr)
        } else {
            identifier += capitalizeFirstLetter(getRandomElement(arr))
        }
    }

    return identifier
}

function generateMainCodeTask5(format, statementNum, calledMethods, methodName) {
    let methodScope = getRandomElement(["public", "private", "protected"])
    let methodReturnType = capitalizeFirstLetter(getRandomElement(nouns))

    let statements = []

    let parameterList = getParameterList(3)
    statements = createStatementsWithUsedMethods(statementNum, calledMethods)

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
    } else if (format == SPECIAL_FORMAT) {
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

function generateCodeWithoutParameterlist(format, methodName) {
    let methodScope = getRandomElement(["public", "private", "protected"])
    let methodReturnType = capitalizeFirstLetter(getRandomElement(nouns))

    let statements = []
    statements = createStatementsWithoutParameterlist(3)

    let code = ""

    if(format == STANDARD_FORMAT) {
        code += `${methodScope} ${methodReturnType} ${methodName}(`
        
        // Parameter list
        code += ") {\n"

        // Method body
        for(let i = 0; i < statements.length; i++) {
            code += `${TAB}${statements[i]};\n`
        }
        code += `${TAB}return get${methodReturnType}();\n`

        code += "}"
    } else if (format == SPECIAL_FORMAT) {
        let methodSignature = `${methodScope} ${methodReturnType} ${methodName}(`
        code += `${methodSignature}`

        // Parameter list
        code += ") {\n"

        // Method body
        let indentationForMethodBody = " ".repeat(code.length)
        for(let i = 0; i < statements.length; i++) {
            if (i == statements.length -1) {
                code += `${indentationForMethodBody}${statements[i]};\n`
                code += `${indentationForMethodBody}return get${methodReturnType}();}\n`
            } else {
                code += `${indentationForMethodBody}${statements[i]};\n`
            }
        }
    } else {
        let methodSignature = `${methodScope} ${methodReturnType} ${methodName}(`
        code += `${methodSignature}`

        // Parameter list
        code += ") {\n"

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

function createStatementsWithUsedMethods(statementNum, calledMethods) {
    let statements = []
    let index = 0

    for(let i = 0; i < statementNum; i++) {
        let irrelevantMethod = createMethodName()
        let methodsToCall = []

        for(let t = 0; t < 4; t++) {
            methodsToCall.push(calledMethods[index])
            index++
        }

        let statement = `${irrelevantMethod}(${methodsToCall[0]}(), ${methodsToCall[1]}(), ${methodsToCall[2]}(), ${methodsToCall[3]}())`
        statements.push(statement)
    }

    return statements
}

function getParameterList(parameterNum) {
    let parameterList = []
    let parameterNames = getRandomElements(nouns, parameterNum)

    for(let name of parameterNames) {
        parameterList.push(`${capitalizeFirstLetter(createIdentifier(nouns))} ${name}`)
    }

    return parameterList
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Zählen aufgerufener Methoden",
        seed: "42",
        introduction_pages: [getIntroduction()],
        pre_run_instruction: getPreRunInstruction(),
        finish_pages: [getFinishPages()],
        layout: [
            { variable: "Formatierung", treatments: ["Standardformatierung", "Alternative Formatierung", "Optimierte Formatierung"]},
            { variable: "Anzahl aufgerufener Methoden", treatments: [1, 2, 3]}
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
            let parameterNum = 3

            if(t.treatment_combination[0].value == STANDARD_FORMAT) {
                t.code = generateCodes(STANDARD_FORMAT, parameterNum, t.expected_answer)
            } else if (t.treatment_combination[0].value == SPECIAL_FORMAT) {
                t.code = generateCodes(SPECIAL_FORMAT, parameterNum, t.expected_answer)
            } else {
                t.code = generateCodes(OPTIMIZED_SPECIAL_FORMAT, parameterNum, t.expected_answer)
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
        "- Dauer des Experiments: ca. 9 Minuten (ohne Trainingszeit).\n" +
        "  " +
        "- Training: Es wird dringend empfohlen, vor Beginn des eigentlichen Experiments das Training durchzuführen, um sich mit der Aufgabe vertraut zu machen. Stellen Sie sicher, dass Ihnen die Aufgabenstellung vollständig klar ist, bevor Sie starten."
}

function getBeispielAufgabe() {
    return "Beispielaufgabe:\n" +
        "Es werden Ihnen mehrere Methoden angezeigt, wobei die erste Methode die Hauptmethode darstellt und die anderen als Hilfsmethoden von ihr aufgerufen werden.\nIhre Aufgabe besteht darin, die Anzahl der aufgerufenen Hilfsmethoden zu ermitteln." +
        "\n\n" +
        "public Avalanche changeSedimentWonderfullyTheoryWhirlpool (ValidationCalculatorVoyageVolcano questioning, HierarchiesSubmarinePlanetSociology imagination, NetworkingYesteryearsGuitarConstellation photon) {\n" +
        "  setGuitarSatelliteExplorerDevelopment(applySociologyInvestmentDevelopmentPublishing(), applyVisibilityBlueprintTelescopeExperience(), createRadiationCycloneBeachfrontVisibility(), addSpectrumTransmittedTelescopeTechnology());\n" +
        "  getAstronomyPredatorNegotiationExplorer(applyLeadershipsObjectivesArchitectUniverse(), removeTransmittedCycloneEducationCooperation(), changeClimateEcosystemPublishingLegislation(), updateBacteriaGovernmentLegislationLeadership());\n" +
        "}\n" +
        "\n" +
        "public Tornado updateBacteriaGovernmentLegislationLeadership () {\n" +
        "  this.setReputationSatisfactionExplorerPerception(controlling, bacterium, memory, wilderness);\n" +
        "  updateVolcanoWildernessPlanetPlanet(negotiation, createAvalancheLanguageYesteryearsPhilosopher(submarine, rainforest), motivation);\n" +
        "  achievement.changeResearchPhotonCycloneSediment(formula, satisfaction, investment);\n" +
        "  return getTornado();\n" +
        "}\n" +
        "\n" +
        "public Planet removeVolcanoProgressionQuestioningConstellation () {\n" +
        "  constellation = university.updateFrequencyVoyageGenerationRocket(planetarium, microphone);\n" +
        "  removeNegotiationConductorControllingSituational(questioning, setSymphonyLaboratoryGenerationMotivation(ecosystem, telescope), progression);\n" +
        "  getCeremonyPhilosopherGenerationGeneration(government, addImaginationAchievementCooperationLeaderships(asteroid, controlling), explorer);\n" +
        "  return getPlanet();\n" +
        "}\n" +
        "\n" +
        "public Vacuum applyLeadershipsObjectivesArchitectUniverse () {\n" +
        "  galaxy = laboratory.getClimateMemoryReasonableHierarchies(constellation, conductor);\n" +
        "  applyDolphinTheoremWorthwhileVolcano(formula, removeHierarchiesBlueprintGalaxyAttraction(ecosystem, pyramid), submarine);\n" +
        "  foundation = legislation.applyUnderwaterViolinExperienceMonument(contributor, volcano);\n" +
        "  return getVacuum();\n" +
        "}"+
        "\n" + "\n" +
        "Nur die zwei Methoden updateBacteriaGovernmentLegislationLeadership() und applyLeadershipsObjectivesArchitectUniverse () wurden in der Hauptmethode aufgerufen. Die richtig Antwort ist also '2'\n\n" +
        "Sie können Ihre Antwort eingeben, indem Sie die entsprechende Zahlentaste [2] drücken.\n" +
        "Um zur nächsten Frage zu gelangen, drücken Sie [Enter]."
}

function getZusaetzlicheHinweise() {
    return "Zusätzliche Hinweise:\n" +
        "- Sie können zwischen den Fragen Pausen einlegen, falls nötig.\n" +
        "- Das Experiment endet, wenn alle Fragen beantwortet wurden. Am Ende wird automatisch eine CSV-Datei heruntergeladen. Bitte ändern Sie den Dateinamen nicht!\n" +
        "\n" +
        "Vielen Dank für Ihre Unterstützung! Wenn Sie bereit sind, drücken Sie auf [Enter], um zu starten."
}
