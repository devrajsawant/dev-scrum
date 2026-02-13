import faq from "../../data/faqs.json";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FaqSection = () => {
  return (
    <div id="#faqs" className="py-20 px-5 bg-gray-900">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center">
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible defaultValue="item-1">
          {faq.map((faq, index) => {
            return (
              <AccordionItem value={`${index}-item`} key={index}>
                <AccordionTrigger className="text-xl font-semibold cursor-pointer">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-lg font-normal">{faq.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default FaqSection;
