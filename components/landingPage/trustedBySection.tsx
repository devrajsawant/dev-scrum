import TrustedByCarousel from "./trustedByCarousel";

const TrustedBySection = () => {
  return (
    <div id="#trustedBy" className="py-20 px-5">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center">
          Trusted By Many Industry Leaders
        </h3>
       <TrustedByCarousel/>
      </div>
    </div>
  );
};

export default TrustedBySection;
