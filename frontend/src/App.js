import React, {useEffect, useState} from "react";
import axios from "axios";

function App() {
  const [message, SetMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/req")
      .then(res => SetMessage(res.data))
      .catch(err => console.error(err))
  }, [])
  return <div>{message}</div>;
}
export default App;
