/**
 * PACEMAKER Platform
 * Operation Runtime
 *
 * Sprint 189
 * Version 1.2.0
 *
 * Responsibility
 * - Complete one ready task in current stage
 * - Record task completion history
 * - Create task completion output
 * - Keep current stage until every task is completed
 * - Move to the next defined stage
 * - Complete operation when no next stage remains
 */

(function (global) {

    "use strict";


    function getCurrentStageTasks(tasks, currentStage) {

        return tasks.filter(function (task) {

            return (
                String(task.stage) ===
                String(currentStage)
            );

        });

    }


    function getNextReadyTask(stageTasks) {

        var i;

        for (i = 0; i < stageTasks.length; i += 1) {

            if (
                stageTasks[i].status !==
                "completed"
            ) {

                return stageTasks[i];

            }

        }

        return null;

    }


    function isStageCompleted(stageTasks) {

        return stageTasks.every(function (task) {

            return (
                task.status ===
                "completed"
            );

        });

    }


    function findNextStage(tasks, currentStage) {

        var stages = [];

        tasks.forEach(function (task) {

            var stage =
                String(task.stage || "");

            if (
                stage &&
                stage !== String(currentStage) &&
                stages.indexOf(stage) === -1
            ) {

                stages.push(stage);

            }

        });

        stages.sort();

        for (var i = 0; i < stages.length; i += 1) {

            if (
                stages[i] >
                String(currentStage)
            ) {

                return stages[i];

            }

        }

        return null;

    }


    function recordTaskCompletion(
        session,
        operation,
        currentTask,
        currentStage
    ) {

        if (
            !Array.isArray(session.history)
        ) {

            session.history = [];

        }


        if (
            !Array.isArray(operation.outputs)
        ) {

            operation.outputs = [];

        }


        session.history.push({

            type:
                "task-completed",

            taskId:
                currentTask.id || null,

            title:
                currentTask.title || "",

            stage:
                currentStage,

            completedAt:
                currentTask.completedAt

        });


        operation.outputs.push({

    id:

        "output-" +
        Date.now(),

    type:

        "task-completed",

    protocol:

        session.protocol.id,

    stage:

        currentStage,

    task: {

        id:
            currentTask.id,

        title:
            currentTask.title

    },

    evidence: {

        completedAt:
            currentTask.completedAt,

        operator:
            "user"

    },

    document:

        null,

    report:

        null

});

    }


    function execute(session) {

        session =
            session || {};

        var operation =
            session.operation || {};

        var tasks =
            Array.isArray(operation.tasks)
                ? operation.tasks
                : [];

        var currentStage =
            String(
                operation.stage || ""
            );


        if (
            !currentStage ||
            !tasks.length
        ) {

            return session;

        }


        var stageTasks =
            getCurrentStageTasks(
                tasks,
                currentStage
            );


        if (!stageTasks.length) {

            return session;

        }


        var currentTask =
            getNextReadyTask(
                stageTasks
            );


        if (currentTask) {

            currentTask.status =
                "completed";

            currentTask.completedAt =
                new Date().toISOString();


            recordTaskCompletion(

                session,
                operation,
                currentTask,
                currentStage

            );

        }


        if (
            isStageCompleted(
                stageTasks
            )
        ) {

            var nextStage =
                findNextStage(
                    tasks,
                    currentStage
                );


            if (nextStage) {

                operation.stage =
                    nextStage;

                operation.status =
                    "ready";

            } else {

                operation.status =
                    "completed";

            }

        }

        if (

    global.PacemakerDocumentRuntime

) {

    global
        .PacemakerDocumentRuntime
        .generate(

            operation,

            {

                type:
                    "operation-document",

                title:
                    currentTask.title

            }

        );

}

        session.operation =
            operation;


        return session;

    }


    global.PacemakerOperationRuntime = {

        execute:
            execute

    };


}(window));