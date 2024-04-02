import { useEffect, useState, useRef } from "react"
function AnswerTimer ({duration, onTimeUp, onScoreChange}) {
    const [counter, setCounter] = useState(0);
    const [progressLoaded, setProgressLoaded] = useState(0);
    const intervalRef = useRef();
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCounter((counter) => counter + 1)
            onScoreChange()
        }, 100)

        return () => clearInterval(intervalRef.current);

    }, []);

    useEffect(() => {
        setProgressLoaded((counter / duration) * 100)
        if (counter === duration) {
            clearInterval(intervalRef.current);
            onTimeUp();
        }
    }, [counter])


    return (
        <div className="answer-timer-container">
            <div 
            style={{width: `${progressLoaded}%`, 
                    backgroundColor: `${progressLoaded < 40 ? "lightgreen" 
                                        : progressLoaded < 80 ? "orange" : "red"}`}}
            className="progress"></div>
        </div>
    )

}

export default AnswerTimer