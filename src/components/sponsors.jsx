import React, { useState, useEffect } from 'react';

const Sponsors = () => {
  const [activePanel, setActivePanel] = useState(0);

  const sponsorData = [
    {
      label: "Raw-Cabbage-on-a-stick Hut",
      title: "Raw-Cabbage-on-a-stick Hut",
      para: "Healthy street snacks made fun! Enjoy tasty cabbage-on-a-stick creations and claim coupons with your BuyMore Dollars prizes.",
      colorClass: "color-green",
      img: "/scratchwin/images/cabbage.png"
    },
    {


      label: "Taco Superstore",
      title: "Taco Superstore",
      para: "Your go to destination for bold and flavorful tacos. Grab your favorites and earn BuyMore Dollars along the way!",
      colorClass: "color-cyan",
      img: "/scratchwin/images/taco.png"
    },
    {
      label: "Glorbotronic Burgers",
      title: "Glorbotronic Burgers",
      para: "Futuristic fast food with a classic twist. Juicy burgers, loaded fries, and a chance to rack up BuyMore Dollars with every bite.",
      colorClass: "color-pink",
      img: "/scratchwin/images/burger.png"
    },
    {
      label: "Fresh Kicks-o-matic Dispenso Booths",
      title: "Fresh Kicks-o-matic Dispenso Booths",
      para: "The latest sneakers delivered instantly. Step up your style game while collecting BuyMore Dollars for exclusive rewards.",
      colorClass: "color-yellow",
      img: "/scratchwin/images/shoes.png"
    }
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setActivePanel(prev => (prev + 1) % sponsorData.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="sponsors-wrapper">
      <h2 className="sponsors-title">MEET THE SPONSORS</h2>
      
      <div className="sponsors-container">
        {sponsorData.map((sponsor, index) => (
          <div
            key={index}
            className={`sponsor-panel ${sponsor.colorClass} ${activePanel === index ? 'active' : ''}`}
            onClick={() => setActivePanel(index)}
          >
            <div className="vertical-label">
              <span>{sponsor.label}</span>
            </div>

            <div className="panel-content">
              <div className="content-flex">
                <div className="image-box">
                   <img src={sponsor.img} alt={sponsor.title} />
                </div>
                <div className="text-box">
                  <h2>{sponsor.title}</h2>
                  <p>{sponsor.para}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sponsors;