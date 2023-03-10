const calcRegex = /^([0-9]|-|\+|\*|\/|\.)*$/;

const keyboard = [
  7,
  8,
  9,
  "/",
  "C",
  4,
  5,
  6,
  "*",
  "Del",
  1,
  2,
  3,
  "-",
  "Ad",
  0,
  ".",
  "+",
  "=",
];

const advancedKeys = ["(", ")", "Hist", "Up", "AC"];

const App = () => (
  <div>
    <Header />
    <Calculator />
  </div>
);

const Header = () => <div className="header">Calculadora</div>;

const Button = ({ value, onClick, className }) => (
  <button
    onClick={() => {
      onClick(value);
    }}
    className={className}
  >
    {value}
  </button>
);

const Calculator = () => {
  const [display, setDisplay] = React.useState("");
  const [error, setError] = React.useState();
  const [showAd, toggleAd] = React.useState(false);
  const [history, setHistory] = React.useState([]);
  const [showHist, toggleHist] = React.useState(false);
  const histRef = React.useRef();

  React.useEffect(() => {
    if (error) {
      setError();
    }
  }, [display]);

  React.useEffect(() => {
    if (history.length > 2 && showHist) {
      histRef.current.scrollTop = histRef.current.scrollHeight;
    }
  }, [history.length, showHist]);

  const doTheMath = () => {
    try {
      const result = eval(display);
      setHistory(
        [].concat(history, {
          calculation: display,
          result,
        })
      );
      setDisplay(`${result}`);
    } catch (err) {
      setError(`Invalid expression: ${err.message}`);
    }
  };

  const handleClick = (value) => {
    switch (value) {
      case "=":
        doTheMath();
        break;
      case "C":
        setDisplay("");
        break;
      case "Del":
        setDisplay(display.substring(0, display.length - 1));
        break;
      case "Ad":
        toggleAd(!showAd);
        toggleHist(false);
        break;
      case "Hist":
        toggleHist(!showHist);
        break;
      case "Up":
        const lastIndex = history.length - 1;
        if (lastIndex > -1) {
          const newDisplay = history[lastIndex].calculation;
          const newHistory = history.slice(0, lastIndex);
          setDisplay(newDisplay);
          setHistory(newHistory);
        }
        break;
      case "AC":
        setDisplay("");
        setHistory([]);
        break;
      default:
        setDisplay(`${display}${value}`);
    }
  };

  const buildButtonKey = (value) => {
    const span2Class = value === 0 ? "span2" : "";
    const primaryClass = isNaN(value) ? "primary" : "";

    return (
      <Button
        key={value}
        value={value}
        onClick={handleClick}
        className={`${span2Class} ${primaryClass}`}
      />
    );
  };

  return (
    <div className="calculator">
      {showHist && (
        <div ref={histRef} className="history">
          {history.map(({ calculation, result }, index) => (
            <p key={index}>{`${calculation} = ${result}`}</p>
          ))}
        </div>
      )}
      <input
        type="text"
        className="display"
        value={display}
        onChange={(event) => {
          const { value } = event.target;

          if (calcRegex.test(value)) {
            setDisplay(event.target.value);
          }
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            doTheMath();
          } else if (event.key.toLowerCase() === "c") {
            setDisplay("");
          }
        }}
      />
      {error && <p className="error">{error}</p>}
      {showAd && (
        <p className="error">
          {error}
          <div className="keyboard">{advancedKeys.map(buildButtonKey)}</div>
        </p>
      )}
      <div className="keyboard">{keyboard.map(buildButtonKey)}</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
