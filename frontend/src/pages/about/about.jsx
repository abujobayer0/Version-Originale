import useNewsletterSubscription from "../../customHooks/newsletterHook/newsLetterHook";
import Swal from "sweetalert2";
import { Collapse } from "react-collapse";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
const Accordion = ({
  title,
  content,
  indx,
  openAccordion,
  setOpenAccordion,
}) => {
  const isOpened = openAccordion === indx;

  const toggleAccordion = () => {
    if (isOpened) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(indx);
    }
  };

  return (
    <div className="accordion mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16">
      <div className="accordion-header pb-4 px-0 max-w-5xl mx-auto">
        <div
          onClick={toggleAccordion}
          className="cursor-pointer flex items-center justify-between transition-colors py-5 md:py-6 px-6 md:px-8 lg:px-10 bg-[#839f9099] helveticaNowDisplay"
        >
          <span>{title}</span>
          {isOpened ? <FaMinus /> : <FaPlus />}
        </div>
        <Collapse isOpened={isOpened} className="opacity-100 h-auto">
          <div className="accordion-content pb-6 md:pb-7 leading-7 text-sm text-white/80 pt-5 border-t border-gray-300 px-6 md:px-8 lg:px-10 bg-[#839f9099] helveticaNowDisplay">
            {content}
          </div>
        </Collapse>
      </div>
    </div>
  );
};
const About = () => {
  const { handleSubscribe } = useNewsletterSubscription();
  const handleSubscrib = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    handleSubscribe(email);
    Swal.fire("You have successfully subscribed");
    form.reset();
    console.log(email);
  };
  const [openAccordion, setOpenAccordion] = useState(0);
  return (
    <section>
      <div className="title-area w-full">
        <div className="page-title-wrapper bg-[#839f9099] w-full h-[173px] flex flex-col justify-center items-center py-10">
          <div className="container-x mx-auto">
            <div className="flex justify-center items-center">
              <h1 className="text-3xl font-semibold text-white euroWide">
                About Us
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row-reverse justify-center  items-center">
        <div className="faq-accordion py-12 w-full  lg:w-1/2 text-white">
          <Accordion
            indx={0}
            title="Our Story?"
            content="Established in [Year], our journey began with a vision: to redefine fashion as an instrument of self-confidence and empowerment..."
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
          <Accordion
            indx={1}
            title="Our Philosophy"
            content="At Version Originale, we are guided by the belief that fashion is more than just a trend; it's a reflection of your personality and a canvas for your emotions. Our designs are born from a deep understanding of our customers' desires and a passion for pushing the boundaries of creativity."
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
          <Accordion
            indx={2}
            contentClassName="text-white"
            title="Unleashing Creativity"
            content="Our creative team is a melting pot of talents from different corners of the world. We blend cultural diversity with contemporary trends to craft collections that are as diverse as our customers. From timeless classics to avant-garde creations, our fashion pieces cater to every style inclination."
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
          <Accordion
            indx={3}
            contentClassName="text-white"
            title="Quality Meets Innovation?"
            content="Quality is the cornerstone of Version Originale. We source the finest materials and employ expert craftsmanship to ensure that every piece you wear is not only stylish but also enduring. Innovation drives us forward, and we constantly explore new techniques and sustainable practices to reduce our environmental footprint."
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
          <Accordion
            indx={4}
            contentClassName="text-white"
            title="Fashion for All"
            content="At the heart of our brand is inclusivity. We celebrate beauty in all its forms and sizes. Our collections are designed to embrace the diversity of our customers. We believe that everyone deserves to feel confident and beautiful in what they wear."
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
          <Accordion
            indx={5}
            contentClassName="text-white"
            title="Customer-Centric Approach"
            content="Our customers are at the center of everything we do. Your feedback and preferences inspire us to create fashion that resonates with your unique style. We aim to provide an exceptional shopping experience, from browsing our collections to the moment you put on our garments."
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
          <Accordion
            indx={6}
            contentClassName="text-white"
            title="Join the Version Originale Community"
            content="We invite you to be part of the Version Originale community, where fashion is an exciting journey of self-discovery. Together, let's redefine style, break boundaries, and celebrate the beauty of being you. Explore our collections, find your voice through fashion, and experience the joy of dressing as an art form."
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
        </div>
        <div className="w-full  lg:w-1/2 h-[70vh]">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/HfPt-HpuxLw?si=UuHOe08wAjiXZz4Y&autoplay=1&mute=1&controls=0"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default About;
