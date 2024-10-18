import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate, redirect } from "react-router-dom";
import PublicQuestionView from "../components/PublicQuestionView";
import axiosClient from "./../axios";
import PatientData from "./PatientData";
import { useStateContext } from "../contexts/ContextProvider";
import { stringify } from "uuid";
import PageComponent from "../components/PageComponent";
import SurveyListItemPublic from "../components/SurveyListItemPublic";
import { useMediaQuery } from "./hooks";
import TButton from "../components/core/TButton";
import {
    PlusCircleIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon,
} from "@heroicons/react/20/solid";
import { useIdleTimer } from "react-idle-timer/legacy";
import Modal from "react-modal";

export default function SurveyPublicView() {
    // Modal
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };

    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    // Modal.setAppElement("#yourAppElement");
    Modal.setAppElement(document.getElementById("yourAppElement"));
    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = "#f00";
    }

    function closeModal() {
        setRemaining(50);
        setIsOpen(false);
    }

    const [modalContent, setModalContent] = useState();
    // END Modal

    // Idle timer
    const [state, setState] = useState("Active");
    const [count, setCount] = useState(0);
    const [remaining, setRemaining] = useState(1);

    const onIdle = () => {
        setState("Idle");
    };

    const onActive = () => {
        setState("Active");
    };

    const onAction = () => {
        setCount(count + 1);
    };

    const { getRemainingTime } = useIdleTimer({
        onIdle,
        onActive,
        onAction,
        timeout: 180_000,
        throttle: 500,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log("setRemaining");
            setRemaining(Math.ceil(getRemainingTime() / 1000));
        }, 500);

        return () => {
            // console.log("clearInterval");
            clearInterval(interval);
        };
    });
    // END Idle timer
    function goHome() {
        // setCurrentPatient();
        console.log("goHome");
        setCurrentPatient({});
        console.log("currentPatient");
        console.log(currentPatient);
        // verifyAvailableSurveys(currentPatient);
        navigate("/");
    }

    useEffect(() => {
        if (remaining === 30) {
            openModal();
        }
        // if (remaining10 === 10) {

        // }
        if (remaining === 0) {
            goHome();
        }
    }, [remaining]);

    const [surveyFinished, setSurveyFinished] = useState(false);
    const [survey, setSurvey] = useState({ questions: [] });
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [meds, setMeds] = useState([]);
    const [countedMeds, setCountedMeds] = useState([]);
    const [loadedConseils, setLoadedConseils] = useState([]);
    const [manquements, setManquements] = useState([]);
    // const [answers, setAnswers] = useState({ 0: "cur" });
    const [answersQuestions, setAnswersQuestions] = useState({});
    const [error, setError] = useState("");
    const [answers2, setAnswers2] = useState({});
    const [additionalSurveys, setAdditionalSurveys] = useState();
    const [finishedAllSurveys, setFinishedAllSurveys] = useState(false);
    const { currentPatient, setCurrentPatient } = useStateContext();
    const { currentPatientHere, setCurrentPatientHere } = useState({});
    const [totalDataPatient, setTotalDataPatient] = useState([]);

    const conseils = [
        {
            id: 1,
            nom: "Cystiphane Biorga Cpr B/120",
            cod: 3560398504251,
            prix: 19.9,
        },
        {
            id: 2,
            nom: "DAYANG OLIGO ELEMENT Se ACR Gél B/30",
            cod: 3700026996130,
            prix: 10.8,
        },
        {
            id: 3,
            nom: "DORIANCE SOLAIRE Caps 2B/30",
            cod: 3700026996130,
            prix: 23.9,
        },
        {
            id: 4,
            nom: "FORCAPIL ANTI-CHUTE Cpr 3Pilul/30",
            cod: 3578835502954,
            prix: 39.4,
        },
        {
            id: 5,
            nom: "FORCAPIL ANTI-CHUTE Gom P/60",
            cod: 3578835504255,
            prix: 39.5,
        },
        {
            id: 6,
            nom: "FORCAPIL CROISSANCE Gom P/60",
            cod: 3578835503494,
            prix: 20.9,
        },
        {
            id: 7,
            nom: "FORCAPIL FOTIF Gél chev ongl pilul/180+6",
            cod: 3401547819976,
            prix: 34.9,
        },
        {
            id: 8,
            nom: "FORCAPIL FORTIF Gél Pilulier/180+600+sh",
            cod: 3578835503258,
            prix: 34.9,
        },
        {
            id: 9,
            nom: "LUXEOL GUMMIES FORCE CROIS Gom P/60",
            cod: 3760007337109,
            prix: 32.9,
        },
        {
            id: 10,
            nom: "NUTRISENTIELS Collagène Gél B/30",
            cod: 3515450070574,
            prix: 7.9,
        },
        {
            id: 11,
            nom: "NUTRISENTIELS Zn Gél B/30",
            cod: 3515450073315,
            prix: 8.5,
        },
        {
            id: 12,
            nom: "SEBACTASE Cpr B/30",
            cod: 3525722014295,
            prix: 15.9,
        },
        {
            id: 13,
            nom: "UV3DERM CONFORT Gél B/120",
            cod: 3525722035170,
            prix: 44.5,
        },
    ];

    useEffect(() => {
        setLoading(true);
        setError("");

        if (currentPatient) {
            console.log("currentPatient");
            console.log(currentPatient);
        }
        if (isObjEmpty(currentPatient)) {
            console.log("currentPatient Object is Empty");
            let patientData = {
                user: "NA",
                age: "NA",
                weight: "NA",
                height: "NA",
                other: handleRandomNum(),
            };
            setCurrentPatient(patientData);
        }
        axiosClient
            .get(`survey/get-by-slug/${slug}`)
            .then(({ data }) => {
                setLoading(false);
                setSurvey(data.data);
                console.log(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
        setLoadedConseils(conseils);
    }, [slug]);

    useEffect(() => {
        if (finishedAllSurveys) {
            console.log("here");

            setTimeout(3000);
            console.log(currentPatient.other_id);

            navigate(`/display-results:${currentPatient.other_id}`);
        } else {
            console.log("still here");
        }
    }, [finishedAllSurveys]);

    useEffect(() => {
        // countSameMedsInArray(meds);
        setCountedMeds(countSameMedsInArray(meds));
    }, [meds]);

    function answerChanged(question, value) {
        console.log(question, value);
        console.log("question.id", question.id);
        console.log(typeof value);
        // const idQuestion = JSON.stringify(question.id);
        const idQuestion = parseInt(question.id);
        console.log(idQuestion);
        // let response = { idQuestion: { value } };
        // answers[question.id] = value;
        let objPrimaire = { idQuestion: value };
        let obj = { ...answersQuestions };
        // let obj = Object.defineProperty(answers, idQuestion, { value });
        // let obj = Object.defineProperty(answersQ, idQuestion, { value });
        obj[idQuestion] = value;
        console.log("obj");
        console.log(obj);

        setAnswersQuestions(obj);

        if (value == "Oui") {
            // console.log("addToMeds");
            addToMeds(question);
        } else if (value == "Non") {
            console.log("removeFromMeds");
            removeFromMeds(question);
        }
    }

    function checkForProduct(id) {
        const filterObj = conseils.filter((e) => e.id == id);

        if (filterObj[0]) {
            return filterObj[0].nom;
        }
    }

    function countSameMedsInArray(myArray) {
        let countObject = myArray.reduce(function (count, currentValue) {
            return (
                count[currentValue]
                    ? ++count[currentValue]
                    : (count[currentValue] = 1),
                count
            );
        }, {});

        setCountedMeds(countObject);
        const keys = Object.keys(countObject);
        const values = Object.values(countObject);
        return countObject;
    }

    function convertObjectOfCountsIntoArray(countedMeds) {
        const res_array = [];
        for (let i in countedMeds) {
            res_array.push([i, countedMeds[i]]);
        }
        res_array.sort((a, b) => b[1] - a[1]);
        return res_array;
    }

    function translateIntoNumbers(desc) {
        let numberedMeds;
        numberedMeds = desc.split(",");
        let resultsWithoutSpaces;
        resultsWithoutSpaces = numberedMeds.map((el) => {
            return el.trim();
        });
        return resultsWithoutSpaces;
    }

    const handleRandomNum = () => {
        // setRandomNum(Math.floor(Math.random() * (maxVal - minVal + 1) + minVal));
        let x = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
        return x;
    };

    function addToMeds(question) {
        let newMeds;
        let manqueDe;
        manqueDe = manquements.concat(question.conseils);

        let medsArray = translateIntoNumbers(question.description);
        newMeds = meds.concat(medsArray);
        setManquements(
            `Pour ` + question.question + " vous avez un manque de " + manqueDe
        );
        setMeds(newMeds);
    }

    function removeFromMeds(question) {
        console.log("removeMeds");
        let newMeds;
        let medsArrayToRemove = translateIntoNumbers(question.description);
        // let medsArray = question.description;

        // console.log("numbers to remove");
        // console.log(medsArray);

        // console.log(meds);

        let removeElement = (myArray, n) => {
            // const myArray = [1, 2, 3, 4, 5];
            // const index = myArray.indexOf(2);
            // const x = myArray.splice(index, 1);
            // console.log(`myArray values: ${myArray}`);

            const index = myArray.indexOf(n);
            const x = myArray.splice(index, 1);
            console.log(`myArray values: ${myArray}`);
            return myArray;
        };
        let arrayOfMultiples;
        arrayOfMultiples = medsArrayToRemove.map((eachElToRemoveFromMeds) => {
            removeElement(meds, eachElToRemoveFromMeds);

            console.log("ArrayLeft in Meds");
            console.log(meds);
        });
    }

    function verifyAvailableSurveys(patient) {
        console.log("patient", patient);
        axiosClient
            .get(`/available/surveys?user=${patient.other}`)
            .then((response) => {
                console.log(response.data);
                setTotalDataPatient(response.data);
                getOnlyLeftOverSurveys(response.data);
            });
    }

    function onSubmit(ev) {
        ev.preventDefault();

        console.log("answersQuestions");
        console.log(answersQuestions);

        axiosClient
            .post(`/survey/${survey.id}/answer`, {
                answers: answersQuestions,
                user: currentPatient["user"],
                age: currentPatient["age"],
                weight: currentPatient["weight"],
                height: currentPatient["height"],
                other: currentPatient["other"],
                other_id: currentPatient["other"],
            })
            .then((response) => {
                console.log(response);
                // debugger;
                setSurveyFinished(true);
                setMeds([]);
                setCountedMeds([]);
                setLoadedConseils([]);
                setManquements([]);
                setAnswersQuestions({});
                // verifyAvailableSurveys(currentPatient["user"]);
                resetPatient();
                // setAdditionalSurveys();
            })
            .catch((error) => {
                console.log(error.message);
                if (error) {
                    setError(
                        "veuillez choisir au moins une réponse avant de valider"
                    );
                }
            });
    }

    function goHome() {
        // setCurrentPatient();
        console.log("goHome");
        setCurrentPatient({});
        console.log("currentPatient");
        console.log(currentPatient);
        // verifyAvailableSurveys(currentPatient);
        navigate("/");
    }

    function getOnlyLeftOverSurveys(data) {
        console.log("data", data);
        const x = data.totalSurveysNumber - data.totalAnswers;
        const {
            totalSurveys,
            totalAnswers,
            totalAnswersByUser,
            totalSurveysNumber,
        } = data;

        console.log("NumberOfStillAvailableSurveys: ", x);
        if (x == 0) {
            console.log("X 378 here");

            setTimeout(3000);

            // navigate("/display-results");
            navigate(`/display-results/` + currentPatient["other"]);
        } else {
            console.log(x);
        }
        console.log("NumberOfAnsweredSurveys: ", totalAnswers);
        let surveysAnsweredIds = [];
        let surveysAnsweredIdsArray = [];
        totalAnswersByUser.map((answer) => {
            console.log(answer.survey_id);
            surveysAnsweredIds.push(answer.survey_id);
        });
        // surveysAnsweredIds = surveysAnsweredIdsArray;
        console.log("surveysAnsweredIds", surveysAnsweredIds);
        let totalSurveyIds = [];
        totalSurveys.map((survey) => {
            totalSurveyIds.push(survey.id);
        });
        console.log("totalSurveyIds", totalSurveyIds);
        // const intersection = totalSurveyIds.filter((element) =>
        //     surveysAnsweredIds.includes(element)
        // );
        const surveysLeftToAnswerIds = totalSurveyIds.filter(
            (element) => !surveysAnsweredIds.includes(element)
        );
        console.log("surveysLeftToAnswerIds", surveysLeftToAnswerIds);

        const surveysLeftToAnswer = totalSurveys.filter((element) =>
            surveysLeftToAnswerIds.includes(element.id)
        );
        console.log("surveysLeftToAnswer", surveysLeftToAnswer);
        if (surveysLeftToAnswer == []) {
            // Finished all surveys
            setFinishedAllSurveys(true);
        } else {
            setAdditionalSurveys(surveysLeftToAnswer);
        }
    }

    function resetPatient() {
        // setCurrentPatientHere({});
        verifyAvailableSurveys(currentPatient);
    }

    function isObjEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    var emptyObject = {};
    var object = { foo: "bar" };
    // return <div>{JSON.stringify(survey, undefined, 2)}</div>;

    const isRowBased = useMediaQuery("(min-width: 500px)");
    return (
        <PageComponent
            title="Veuillez remplir vos données."
            buttons={
                <TButton
                    color="red"
                    onClick={goHome}
                    className="w-60 flex justify-center rounded-md border 
                    border-transparent bg-indigo-600 py-4 px-4  font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  text-lg"
                >
                    <span className="text-lg">
                        Revenir au debut / Recommencer
                    </span>
                    <ExclamationTriangleIcon className="h-6 w-6 ml-2" />
                </TButton>
            }
            // image={logo}
        >
            <>
                {/* MODAL */}
                <div id="yourAppElement">
                    {/* <button onClick={openModal}>Open Modal</button> */}
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                        // className="items-center"
                    >
                        <h2>
                            {" "}
                            <span className="text-2xl font-bold">
                                Vous êtes toujours là ?
                            </span>
                        </h2>

                        <div className="w-80 flex flex-col items-center  border-t-4 border-green-500">
                            <div className="mb-2 mt-3">
                                <TButton
                                    color="green"
                                    onClick={closeModal}
                                    className="w-60 flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {" "}
                                    <span className="text-xl">
                                        Cliquez ici pour révenir
                                    </span>
                                </TButton>
                            </div>

                            <div className="text-2xl font-bold">
                                Sinon l'enquete va redémarrer en {remaining}{" "}
                                secondes.
                            </div>

                            <TButton
                                color="red"
                                onClick={goHome}
                                className="mt-3 w-60 flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span className="text-xl">
                                    Revenir au debut
                                </span>
                                <ExclamationTriangleIcon className="h-6 w-6 ml-2" />
                            </TButton>
                        </div>
                    </Modal>
                </div>
                {/* END MODAL */}
            </>
            <>
                {/* FORM Patient */}
                {isObjEmpty(currentPatient) && (
                    <div className="content-center">
                        <div
                            className="content-center "
                            style={{
                                margin: "auto",
                                width: isRowBased ? "50%" : "90%",
                            }}
                        >
                            <p className="max-w-md text-lg">
                                Les champs de données à remplir ne sont{" "}
                                <strong>pas obligatoires</strong>.
                            </p>
                        </div>
                        <div
                            className=" md:container md:mx-auto sm:grid-cols max-w-lg"
                            style={{
                                margin: "auto",
                                width: isRowBased ? "50%" : "90%",
                            }}
                        >
                            <PatientData />
                        </div>
                    </div>
                )}
                {/* END FORM Patient */}

                <div>
                    {loading && (
                        <div className="flex justify-center">Chargement...</div>
                    )}
                    {!loading && !isObjEmpty(currentPatient) && (
                        <>
                            <div className="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50">
                                <form
                                    onSubmit={(ev) => onSubmit(ev)}
                                    className="container mx-auto "
                                >
                                    <div className="grid grid-cols-6">
                                        {!surveyFinished && (
                                            <>
                                                <div className="mr-4">
                                                    <img
                                                        src={survey.image_url}
                                                        alt=""
                                                        className="w-full object-cover rounded-md mb-8"
                                                    />
                                                </div>
                                                <div className="col-span-3 mb-8">
                                                    <h1 className="text-3xl mb-3">
                                                        {survey.title}
                                                    </h1>
                                                    {/* <p className="text-gray-500 text-sm mb-3">
                                            Expire date:{" "}
                                            {survey.expire_date}
                                        </p> */}
                                                    <p className="text-gray-500 text-sm mb-3">
                                                        Description:{" "}
                                                        {survey.description}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {finishedAllSurveys && (
                                        <>
                                            <div className="py-2 px-2 bg-emerald-500 text-white w-[600px] mx-auto">
                                                Merci ! Vous avez fini de
                                                répondre à nos questionnaires.
                                            </div>
                                        </>
                                    )}
                                    {surveyFinished && (
                                        <>
                                            <div className="py-2 px-6 mb-4 bg-sky-500 text-white  mx-auto text-xl">
                                                Merci d'avoir répondu aux
                                                questions sur les{" "}
                                                <strong>{survey.title}</strong>
                                            </div>
                                            <ul>
                                                {/* {additionalSurveys && (
                                                    <li>
                                                        <p className="mt-3 mb-1 text-xl">
                                                            Ou vous pouvez
                                                            trouver et
                                                            sauvegarder vos
                                                            réponses et voir nos
                                                            recomandations :
                                                        </p>
                                                        <div
                                                            className="place-content-center"
                                                            style={{
                                                                display: "flex",
                                                            }}
                                                        >
                                                            <TButton
                                                                
                                                                to={`/display-results/${currentPatient.other}`}
                                                                className="w-40 flex rounded-md border border-transparent bg-orange-500 py-4 px-4  font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2  text-xl"
                                                                style={{
                                                                    backgroundColor:
                                                                        "orange !important",
                                                                }}
                                                            >
                                                                <span className="text-xl">
                                                                    Voir les
                                                                    résultats
                                                                </span>
                                                                <CheckBadgeIcon className="h-6 w-6 ml-2" />
                                                            </TButton>
                                                        </div>
                                                    </li>
                                                )} */}

                                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                                                    {/* {additionalSurveys && (
                                                        <li>
                                                            <p className="text-xl">
                                                                Vous pouvez
                                                                continuer à
                                                                répondre sur les
                                                                sujets suivants
                                                                :{" "}
                                                            </p>
                                                        </li>
                                                    )} */}
                                                    {additionalSurveys && (
                                                        <li>
                                                            <div className="flex flex-row">
                                                                <p className="text-xl">
                                                                    Vous pouvez
                                                                    continuer à
                                                                    répondre&nbsp;sur
                                                                    les sujets
                                                                    suivants :{" "}
                                                                </p>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className=" text-indigo-500 h-12 w-12"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <hr></hr>
                                                            <p className="mt-3 mb-1 text-xl text-sky-500">
                                                                <strong>
                                                                    Ou vous
                                                                    pouvez
                                                                    trouver et
                                                                    sauvegarder
                                                                    vos réponses
                                                                    et voir nos
                                                                    recomandations
                                                                    :
                                                                </strong>
                                                            </p>
                                                            <div
                                                                className="place-content-center "
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                }}
                                                            >
                                                                <TButton
                                                                    color="blue"
                                                                    to={`/display-results/${currentPatient.other}`}
                                                                    className="w-40 flex rounded-md border border-transparent
                                                                    bg-cyan-500  py-4 px-4  font-medium text-white
                                                                      hover:bg-cyan-600  focus:outline-none focus:ring-2 focus:bg-sky-500
                                                                       focus:ring-offset-2 text-xl"
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <span className="text-xl ">
                                                                        Voir&nbsp;les&nbsp;résultats
                                                                    </span>
                                                                    <CheckBadgeIcon className="h-6 w-6 ml-2" />
                                                                </TButton>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {additionalSurveys &&
                                                        additionalSurveys.map(
                                                            (surveyLeft) => (
                                                                <>
                                                                    <li
                                                                        key={
                                                                            surveyLeft.title
                                                                        }
                                                                    >
                                                                        <Link
                                                                            to={`/survey/public/${surveyLeft.slug}`}
                                                                            // state={{ answer: "occupation" }}
                                                                            // state={{ from: "occupation" }}
                                                                            onClick={() =>
                                                                                setSurveyFinished(
                                                                                    false
                                                                                )
                                                                            }
                                                                            className="block p-2 hover:bg-gray-100/90"
                                                                        >
                                                                            <SurveyListItemPublic
                                                                                inactive={
                                                                                    surveyLeft.status ==
                                                                                    0
                                                                                }
                                                                                survey={
                                                                                    surveyLeft
                                                                                }
                                                                                key={
                                                                                    surveyLeft.id
                                                                                }
                                                                                continuedSurvey
                                                                                // onDeleteClick={onDeleteClick}
                                                                            />
                                                                            {/* {
                                                                                surveyLeft.title
                                                                            } */}
                                                                        </Link>
                                                                    </li>
                                                                </>
                                                            )
                                                        )}
                                                </div>
                                            </ul>
                                        </>
                                    )}
                                    {!surveyFinished && (
                                        <>
                                            <div>
                                                {survey.questions &&
                                                    survey.questions.map(
                                                        (question, index) => (
                                                            <PublicQuestionView
                                                                key={
                                                                    question.id
                                                                }
                                                                question={
                                                                    question
                                                                }
                                                                index={index}
                                                                answerChanged={(
                                                                    val
                                                                ) =>
                                                                    answerChanged(
                                                                        question,
                                                                        val
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    )}
                                            </div>
                                            {error && (
                                                <p
                                                    className="text-red text-xl"
                                                    style={{ color: "red" }}
                                                >
                                                    Veuillez choisir au moins
                                                    une réponse avant de valider
                                                </p>
                                            )}
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center py-2 px-4 borer border-transparent shadow-sm text-xl font-medium rounded-md text-white bg-indigo-600
                        hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Valider
                                            </button>
                                        </>
                                    )}
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </>
        </PageComponent>
    );
}
