(() => {

    "use strict";


    // ==========================================
    // YOUR RENDER BACKEND
    // ==========================================

    const API_BASE =
        "https://mental-report.onrender.com";


    // ==========================================
    // HTML ELEMENTS
    // ==========================================

    const form =
        document.getElementById("predict-form");

    const submitBtn =
        document.getElementById("submit-btn");

    const resetBtn =
        document.getElementById("reset-btn");

    const retryBtn =
        document.getElementById("error-retry-btn");


    const resultState =
        document.getElementById("state-result");

    const loadingState =
        document.getElementById("state-loading");

    const errorState =
        document.getElementById("state-error");


    const scoreNumber =
        document.getElementById("score-number");

    const scoreBand =
        document.getElementById("score-band");

    const scoreContext =
        document.getElementById("score-context");

    const gauge =
        document.getElementById("gauge-fill");


    const errorLabel =
        document.getElementById("error-label");

    const errorCopy =
        document.getElementById("error-copy");


    const stressGroup =
        document.getElementById(
            "stress_level_group"
        );

    const stressInput =
        document.getElementById(
            "stress_level"
        );


    const GAUGE_LENGTH = 314;



    // ==========================================
    // SHOW UI STATE
    // ==========================================

    function showState(state) {

        resultState.hidden = true;
        loadingState.hidden = true;
        errorState.hidden = true;


        if (state === "result") {

            resultState.hidden = false;

        }


        if (state === "loading") {

            loadingState.hidden = false;

        }


        if (state === "error") {

            errorState.hidden = false;

        }

    }



    // ==========================================
    // CLEAR FIELD ERROR
    // ==========================================

    function clearFieldError(input) {

        if (!input) return;


        const field =
            input.closest(".field");


        if (!field) return;


        field.classList.remove(
            "field-error"
        );


        const error =
            field.querySelector(
                ".error-msg"
            );


        if (error) {

            error.textContent = "";

        }

    }



    // ==========================================
    // SET FIELD ERROR
    // ==========================================

    function setFieldError(
        input,
        message
    ) {

        if (!input) return;


        const field =
            input.closest(".field");


        if (!field) return;


        field.classList.add(
            "field-error"
        );


        const error =
            field.querySelector(
                ".error-msg"
            );


        if (error) {

            error.textContent =
                message;

        }

    }



    // ==========================================
    // CLEAR ALL ERRORS
    // ==========================================

    function clearAllErrors() {

        form
            .querySelectorAll(".field")
            .forEach(field => {

                field.classList.remove(
                    "field-error"
                );

            });


        form
            .querySelectorAll(".error-msg")
            .forEach(error => {

                error.textContent = "";

            });

    }



    // ==========================================
    // COLLECT FORM DATA
    // ==========================================

    function collectPayload() {

        const data =
            new FormData(form);


        /*
            IMPORTANT

            These names MUST match
            your FastAPI StudentData model.
        */

        return {

            Age:
                parseInt(
                    data.get("age"),
                    10
                ),


            Gender:
                data.get("gender") || "",


            Country:
                (
                    data.get("country") || ""
                ).trim(),


            Academic_Level:
                data.get(
                    "academic_level"
                ) || "",


            Most_Used_Platform:
                data.get(
                    "most_used_platform"
                ) || "",


            Purpose_Of_Use:
                data.get(
                    "purpose_of_use"
                ) || "",


            Avg_Daily_Usage_Hours:
                parseFloat(
                    data.get(
                        "avg_daily_usage_hours"
                    )
                ),


            Daily_Unlocks:
                parseInt(
                    data.get(
                        "daily_unlocks"
                    ),
                    10
                ),


            Study_Hours:
                parseFloat(
                    data.get(
                        "study_hours"
                    )
                ),


            Physical_Activity_Hours:
                parseFloat(
                    data.get(
                        "physical_activity_hours"
                    )
                ),


            Sleep_Hours_Per_Night:
                parseFloat(
                    data.get(
                        "sleep_hours_per_night"
                    )
                ),


            Stress_Level:
                data.get(
                    "stress_level"
                ) || ""

        };

    }



    // ==========================================
    // FRONTEND VALIDATION
    // ==========================================

    function validate(data) {

        const errors = [];


        const numbers = [

            [
                "Age",
                "age",
                10,
                100
            ],

            [
                "Avg_Daily_Usage_Hours",
                "avg_daily_usage_hours",
                0,
                24
            ],

            [
                "Daily_Unlocks",
                "daily_unlocks",
                0,
                Infinity
            ],

            [
                "Study_Hours",
                "study_hours",
                0,
                24
            ],

            [
                "Physical_Activity_Hours",
                "physical_activity_hours",
                0,
                24
            ],

            [
                "Sleep_Hours_Per_Night",
                "sleep_hours_per_night",
                0,
                24
            ]

        ];


        numbers.forEach(
            ([key, id, min, max]) => {

                const value =
                    data[key];


                const input =
                    document.getElementById(
                        id
                    );


                if (!Number.isFinite(value)) {

                    errors.push([
                        input,
                        "This field is required."
                    ]);

                }

                else if (
                    value < min ||
                    value > max
                ) {

                    errors.push([
                        input,
                        `Must be between ${min} and ${max}.`
                    ]);

                }

            }
        );



        const required = [

            [
                "Gender",
                "gender"
            ],

            [
                "Country",
                "country"
            ],

            [
                "Academic_Level",
                "academic_level"
            ],

            [
                "Most_Used_Platform",
                "most_used_platform"
            ],

            [
                "Purpose_Of_Use",
                "purpose_of_use"
            ]

        ];


        required.forEach(
            ([key, id]) => {

                const input =
                    document.getElementById(
                        id
                    );


                if (
                    !data[key] ||
                    String(
                        data[key]
                    ).trim() === ""
                ) {

                    errors.push([
                        input,
                        "This field is required."
                    ]);

                }

            }
        );



        if (!data.Stress_Level) {

            errors.push([
                stressInput,
                "Pick a stress level."
            ]);

        }


        return errors;

    }



    // ==========================================
    // STRESS BUTTONS
    // ==========================================

    stressGroup
        .querySelectorAll(".stress-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    stressGroup
                        .querySelectorAll(
                            ".stress-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    stressInput.value =
                        button.dataset.value;


                    clearFieldError(
                        stressInput
                    );

                }
            );

        });



    // ==========================================
    // SCORE CATEGORY
    // ==========================================

    function getScoreCategory(score) {

        if (score < 4) {

            return {

                title:
                    "Signal: strained",

                text:
                    "Your responses suggest elevated strain according to this model. Consider reviewing your sleep, screen time and daily recovery."

            };

        }


        if (score < 7) {

            return {

                title:
                    "Signal: balanced",

                text:
                    "Your reported habits fall into a relatively balanced range according to this model."

            };

        }


        return {

            title:
                "Signal: strong",

            text:
                "Your reported habits correspond to a stronger range according to this model."

        };

    }



    // ==========================================
    // DISPLAY RESULT
    // ==========================================

    function showResult(score) {

        const safeScore =
            Math.max(
                0,
                Math.min(
                    10,
                    Number(score)
                )
            );


        const category =
            getScoreCategory(
                safeScore
            );


        scoreNumber.textContent =
            safeScore.toFixed(2);


        scoreBand.textContent =
            category.title;


        scoreContext.textContent =
            category.text;



        // Reset gauge

        gauge.style.transition =
            "none";

        gauge.style.strokeDashoffset =
            GAUGE_LENGTH;



        // Animate gauge

        requestAnimationFrame(() => {

            gauge.style.transition =
                "stroke-dashoffset 1s ease";


            const offset =
                GAUGE_LENGTH *
                (
                    1 -
                    safeScore / 10
                );


            gauge.style.strokeDashoffset =
                offset;

        });


        showState("result");


        resultState.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }



    // ==========================================
    // DISPLAY ERROR
    // ==========================================

    function showError(
        title,
        message
    ) {

        errorLabel.textContent =
            title;


        errorCopy.textContent =
            message;


        showState("error");

    }



    // ==========================================
    // FASTAPI 422 ERROR
    // ==========================================

    function handleServerErrors(
        detail
    ) {

        if (!Array.isArray(detail)) {

            return false;

        }


        let matched = false;


        detail.forEach(error => {

            const location =
                Array.isArray(error.loc)
                    ? error.loc
                    : [];


            const backendField =
                location[
                    location.length - 1
                ];


            const fieldMap = {

                Age: "age",

                Gender: "gender",

                Country: "country",

                Academic_Level:
                    "academic_level",

                Most_Used_Platform:
                    "most_used_platform",

                Purpose_Of_Use:
                    "purpose_of_use",

                Avg_Daily_Usage_Hours:
                    "avg_daily_usage_hours",

                Daily_Unlocks:
                    "daily_unlocks",

                Study_Hours:
                    "study_hours",

                Physical_Activity_Hours:
                    "physical_activity_hours",

                Sleep_Hours_Per_Night:
                    "sleep_hours_per_night",

                Stress_Level:
                    "stress_level"

            };


            const input =
                backendField ===
                "Stress_Level"

                    ? stressInput

                    : document.getElementById(
                        fieldMap[
                            backendField
                        ]
                    );


            if (input) {

                setFieldError(
                    input,
                    error.msg ||
                    "Invalid value."
                );


                matched = true;

            }

        });


        return matched;

    }



    // ==========================================
    // FORM SUBMISSION
    // ==========================================

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearAllErrors();


            const payload =
                collectPayload();


            console.log(
                "Sending:",
                payload
            );


            const errors =
                validate(payload);


            if (errors.length > 0) {

                errors.forEach(
                    ([input, message]) => {

                        setFieldError(
                            input,
                            message
                        );

                    }
                );


                errors[0][0]?.focus?.();


                return;

            }



            // Loading

            submitBtn.disabled =
                true;

            submitBtn.classList.add(
                "loading"
            );


            showState("loading");



            try {

                const response =
                    await fetch(
                        `${API_BASE}/predict`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    payload
                                )

                        }
                    );



                const body =
                    await response
                        .json()
                        .catch(
                            () => null
                        );



                // 422

                if (
                    response.status === 422
                ) {

                    const matched =
                        body &&
                        handleServerErrors(
                            body.detail
                        );


                    showError(

                        "Check your inputs",

                        matched
                            ? "The API rejected one or more fields. Check the highlighted fields."
                            : "The API rejected your submission. Check your inputs and try again."

                    );


                    return;

                }



                // Other errors

                if (!response.ok) {

                    const message =
                        body &&
                        typeof body.detail ===
                        "string"

                            ? body.detail

                            : `API returned status ${response.status}.`;


                    showError(
                        "Prediction failed",
                        message
                    );


                    return;

                }



                // SUCCESS

                if (
                    !body ||
                    typeof body
                        .predicted_mental_health_score
                    !== "number"
                ) {

                    showError(

                        "Unexpected response",

                        "The API responded, but the prediction score was missing."

                    );


                    return;

                }



                showResult(
                    body
                        .predicted_mental_health_score
                );


            }


            catch (error) {

                console.error(
                    error
                );


                showError(

                    "Can't reach the server",

                    "The frontend could not connect to your deployed FastAPI backend."

                );

            }


            finally {

                submitBtn.disabled =
                    false;

                submitBtn.classList.remove(
                    "loading"
                );

            }

        }
    );



    // ==========================================
    // RESET
    // ==========================================

    resetBtn.addEventListener(
        "click",
        () => {

            form.reset();


            stressInput.value =
                "";


            stressGroup
                .querySelectorAll(
                    ".stress-btn"
                )
                .forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });


            clearAllErrors();


            showState("idle");


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );



    // ==========================================
    // RETRY
    // ==========================================

    retryBtn.addEventListener(
        "click",
        () => {

            showState("idle");


            form.scrollIntoView({
                behavior: "smooth"
            });

        }
    );



    // ==========================================
    // CLEAR ERRORS WHILE TYPING
    // ==========================================

    form
        .querySelectorAll(
            "input, select"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    clearFieldError(
                        input
                    );

                }
            );


            input.addEventListener(
                "change",
                () => {

                    clearFieldError(
                        input
                    );

                }
            );

        });


})();