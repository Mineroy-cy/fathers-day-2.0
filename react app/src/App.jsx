import React, { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import "./App.css";

const heroStrings = [
  "ALL DADS","DAD-TO-BE","THOSE WHO PLAYS THE ROLE OF A FATHER",
  "DADS IN HEAVEN","STEP-DADS & SECOND DADS",
  "DADS WHO LOST A CHILD","FUR-DADS","THOSE WHO CAN'T BE WITH THEIR FATHERS",
  "ADOPTIVE DADS","SINGLE DADS","NEW DADS","GRAND-DADS RAISING GRANDKIDS"
];

const imageUrls = [
   "images/all dads.jpeg",
  "images/dad to be.jpeg",
  "images/those who play the role of a father.jpeg",
  "images/dads in heaven 2.jpeg",
  "images/stepdad.jpg",
  "images/dad who lost child.jpeg",
  "images/fur dad.jpeg",
  "images/dads with lost dads.jpg",
  "images/adoptive dad2.jpg",
  "images/single dad.jpg",
  "images/new dad.jpg",
  "images/granddad raising.jpg"
];

function App() {
  const typedRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [gallery, setGallery] = useState([]);

  // Load gallery from localStorage on mount
  useEffect(() => {
    const savedGallery = localStorage.getItem("gallery");
    if (savedGallery) {
      setGallery(JSON.parse(savedGallery));
    }
  }, []);

  // Save gallery to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gallery", JSON.stringify(gallery));
  }, [gallery]);

  // Typed.js effect and slider sync
  useEffect(() => {
    let typedInstance;
    if (typedRef.current) {
      typedInstance = new Typed(typedRef.current, {
        strings: heroStrings,
        typeSpeed: 50,
        backSpeed: 10,
        backDelay: 700,
        loop: true,
        showCursor: false,
        preStringTyped: (arrayPos) => {
          setSlideIndex(arrayPos % imageUrls.length);
        }
      });
    }
    return () => {
      if (typedInstance) typedInstance.destroy();
    };
  }, []);

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const caption = window.prompt(
          "Write a special caption for your father's photo (optional):",
          "My Hero, My Dad"
        ) || "My Hero, My Dad";
        setGallery(gallery => [
          ...gallery,
          { src: event.target.result, caption }
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // Remove image handler
  const handleRemove = (idx) => {
    setGallery(gallery => gallery.filter((_, i) => i !== idx));
  };

  return (
    <div className="app-root">
      <header className="main-header">
        <h1>Let's Celebrate Our Fathers Together</h1>
        <p className="main-subtitle">
          Upload a photo and share a special caption for your hero!
        </p>
      </header>

      <div className="main-content">
        <section className="_hero">
          {imageUrls.map((url, idx) => (
            <div
              key={url}
              className={`background-slide${slideIndex === idx ? " active" : ""}`}
              style={{ backgroundImage: `url('${url}')` }}
            />
          ))}
          <div className="background-overlay"></div>
          <header className="hero">
            <div className="title_description">
              <h1 className="title_paragraph">Happy Fathers Day To</h1>
              <span className="typeOfFather" ref={typedRef}></span>
            </div>
          </header>
        </section>

        <section className="gallery-section">
          <h2 className="gallery-title">Share The Photo of The Hero You call DAD</h2>
          <button
            className="add-image-btn"
            onClick={() => document.getElementById("imageInput").click()}
          >
            Add Image
          </button>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <div className="image-gallery">
            {gallery.map((img, idx) => (
              <div className="image-card" key={idx}>
                <img src={img.src} alt="Father" />
                <div className="caption">{img.caption}</div>
                <button
                  className="remove-btn"
                  title="Remove"
                  onClick={() => handleRemove(idx)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;