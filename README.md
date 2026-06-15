# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


File Structure 

src/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── components/
│   │
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SectionHeading.jsx
│   │   ├── CTAButton.jsx
│   │   ├── SearchBar.jsx
│   │   └── PropertyCard.jsx
│   │
│   ├── home/
│   │   ├── Hero.jsx
│   │   ├── AboutUs.jsx
│   │   ├── WhyChooseUs.jsx
│   │   ├── PropertyCategories.jsx
│   │   ├── SearchFilters.jsx
│   │   ├── FeaturedProjects.jsx
│   │   ├── RentalServices.jsx
│   │   ├── InvestmentAdvisory.jsx
│   │   ├── EMISection.jsx
│   │   ├── ArchitectsSection.jsx
│   │   ├── InteriorDesignSection.jsx
│   │   ├── HomeLoanSection.jsx
│   │   ├── PropertyManagementSection.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── ChannelPartnerSection.jsx
│   │   ├── BlogPreview.jsx
│   │   ├── NewsSection.jsx
│   │   ├── Testimonials.jsx
│   │   ├── FAQ.jsx
│   │   └── ContactSection.jsx
│   │
│   ├── property/
│   │   ├── PropertyGrid.jsx
│   │   ├── PropertyDetailsHero.jsx
│   │   ├── PropertyGallery.jsx
│   │   ├── Amenities.jsx
│   │   ├── FloorPlans.jsx
│   │   ├── VirtualTour.jsx
│   │   ├── LocationMap.jsx
│   │   ├── SimilarProperties.jsx
│   │   └── BookVisitForm.jsx
│   │
│   ├── calculators/
│   │   ├── EMICalculator.jsx
│   │   ├── ROICalculator.jsx
│   │   ├── RentalYieldCalculator.jsx
│   │   ├── AffordabilityCalculator.jsx
│   │   ├── DownPaymentCalculator.jsx
│   │   ├── StampDutyCalculator.jsx
│   │   └── RegistrationCostCalculator.jsx
│   │
│   ├── blog/
│   │   ├── BlogCard.jsx
│   │   ├── BlogList.jsx
│   │   ├── BlogSidebar.jsx
│   │   └── BlogContent.jsx
│   │
│   ├── forms/
│   │   ├── InquiryForm.jsx
│   │   ├── ContactForm.jsx
│   │   ├── SiteVisitForm.jsx
│   │   ├── LoanInquiryForm.jsx
│   │   └── PartnerForm.jsx
│   │
│   └── admin/
│       ├── Dashboard.jsx
│       ├── PropertyManager.jsx
│       ├── BlogManager.jsx
│       ├── TestimonialManager.jsx
│       ├── InquiryManager.jsx
│       ├── MediaManager.jsx
│       └── UserManager.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Properties.jsx
│   ├── PropertyDetails.jsx
│   ├── Investment.jsx
│   ├── Rental.jsx
│   ├── Blog.jsx
│   ├── BlogDetails.jsx
│   ├── Contact.jsx
│   ├── Calculators.jsx
│   ├── Services.jsx
│   ├── PartnerProgram.jsx
│   ├── Login.jsx
│   └── Admin.jsx
│
├── data/
│   ├── properties.js
│   ├── testimonials.js
│   ├── faq.js
│   ├── blogs.js
│   └── projects.js
│
├── hooks/
│
├── utils/
│
├── App.jsx
├── main.jsx
└── index.css
