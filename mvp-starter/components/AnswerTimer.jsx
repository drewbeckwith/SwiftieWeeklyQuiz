import { useEffect, useState, useRef } from "react"
function AnswerTimer ({duration}) {
    const [counter, setCounter] = useState(0);
    const [progressLoaded, setProgressLoaded] = useState(0);
    const intervalRef = useRef();
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCounter((counter) => counter + 1)
        }, 1000)

        return () => clearInterval(intervalRef.current);

    }, []);

    useEffect(() => {
        setProgressLoaded((counter / duration) * 100)
        if (counter === duration) {
            clearInterval(intervalRef.current);
        }
    }, [counter])


    return (
        <div className="answer-timer-container">
            <div className="progess"></div>
        </div>
    )

}

export default AnswerTimer