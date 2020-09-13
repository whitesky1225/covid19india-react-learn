import React, { useState, useEffect } from "react";
import Footer from './Footer'
import { Helmet } from "react-helmet";

const DATA_URL = "https://api.covid19india.org/website_data.json";
function About() {
  const [faq, setFaq] = useState([]);
  useEffect(() => getFAQs(), []);
  const getFAQs = () => {
    fetch(DATA_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
          console.log(2222,data)
        setFaq(data.faq);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <React.Fragment>
      <Helmet>
        <title>About - covid19india.org</title>
      </Helmet>
      <div className="About">
        {faq.map((faq, index) => {
          return (
            <div
              className="faq fadeInUp"
              key={index}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <h2 className="question">{faq.question}</h2>
              <h2 className="answer" dangerouslySetInnerHTML={{__html: faq.answer}}></h2>
            </div>
          );
        })}
      </div>
      <Footer />
    </React.Fragment>
  );
}
export default About;
