import { useState } from "react";

import "./App.css";
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";

import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // flex

import InputDateMask from "./component/inputDateMask";

type DateInfo = {
  date: Date | null;
  isValidDate: boolean;
  dateString: string;
};

function App() {
  const [dateInfo, setDateInfo] = useState<DateInfo>({
    date: null,
    isValidDate: false,
    dateString: "",
  });

  const handleDateChange = (data: DateInfo) => {
    setDateInfo(data);
  };

  return (
    <div className="App">
      <InputDateMask onChange={handleDateChange} />
      <div className="card flex justify-content-center gap-3 mt-3">
        <div>
          <p>Selected Date: {dateInfo.date?.toLocaleDateString()}</p>
          <p>Is Valid Date: {dateInfo.isValidDate.toString()}</p>
          <p>Date String: {dateInfo.dateString}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
