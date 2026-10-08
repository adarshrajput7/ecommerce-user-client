import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";

const sections = [
  { title: "Shop", links: [{ name: "An Ode to Cricket", href: "/cricket" }, { name: "Active Lifestyle", href: "/active" }, { name: "Cover Drive", href: "/cover-drive" }, { name: "Hybrid Workout", href: "/workout" }] },
  { title: "one8", links: [{ name: "About one8", href: "/about" }, { name: "The one8 Promise", href: "/promise" }] },
  { title: "Customer Support", links: [{ name: "Contact Us", href: "/contact" }, { name: "Return & Exchange", href: "/returns" }, { name: "FAQs", href: "/faqs" }] },
  { title: "Account", links: [{ name: "Log In", href: "/login" }] },
  { title: "Legal", links: [{ name: "Privacy Policy", href: "/privacy" }, { name: "Terms of Use", href: "/terms" }, { name: "Warranty Policy", href: "/warranty" }, { name: "Cookie Policy", href: "/cookies" }] },
];

const socials = [{ icon: FaFacebookF, href: "#" }, { icon: FaXTwitter, href: "#" }, { icon: FaInstagram, href: "#" }, { icon: FaLinkedinIn, href: "#" }, { icon: FaYoutube, href: "#" }];

export default function Footer() {
  const [open, setOpen] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();

    // Proper email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success("Subscribed successfully! 🎉");
  };


  return (
    <footer className="px-5 lg:px-12 pt-10 bg-[#1a1a1a] text-white overflow-hidden">
      <div>
        <h2 className="text-2xl lg:text-3xl md:text-4xl font-bold pb-2">Join the one8 movement</h2>
        <p className="text-neutral-400 text-sm md:text-base">Get exclusive drops, training tips, and stories that fuel your next breakthrough.</p>
      </div>

      <form
        onSubmit={handleSubscribe}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full"
      >
        <input
          name="email"
          type="email"
          placeholder="Enter your email address"
          required
          autoComplete="email"
          className="w-[95vw] sm:w-auto sm:flex-1 bg-transparent text-white text-xl md:text-4xl font-semibold px-4 py-4 border-b border-b-neutral-600 border-t-transparent border-x-transparent rounded-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#00FFFF] transition-all duration-200"
        />

        <button
          type="submit"
          className="w-[95vw] sm:w-auto bg-[#00FFFF] py-3.5 px-8 rounded-full text-black font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Join the newsletter
        </button>
      </form>




      <div className="lg:mt-16 mt-10 py-8 border-y border-white flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="border-b  border-neutral-800 md:border-none pb-3 md:pb-0">
              <button onClick={() => setOpen(open === idx ? null : idx)} className="w-full flex justify-between items-center text-left font-bold text-base md:cursor-default">
                <span>{sec.title}</span>
                <span className="md:hidden text-neutral-100">{open === idx ? <Minus /> : <Plus />}</span>
              </button>
              {/* <ul className={`space-y-2.5 text-sm text-neutral-400 mt-3 ${open === idx ? "block" : "hidden md:block"}`}>
                {sec.links.map((link, i) => (
                  <li key={i}><a href={link.href} className="hover:text-white transition-colors">{link.name}</a></li>
                ))}
              </ul> */}
              <ul className={` space-y-2.5 text-sm text-neutral-400 mt-3 grid transition-[grid-template-rows] duration-300 ease-out ${open === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} md:grid-rows-[1fr]`}>
                <div className="overflow-hidden">
                  {sec.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="block hover:text-white transition-colors duration-200">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </div>
              </ul>

            </div>
          ))}
        </div>

        <div className="lg:w-64 lg:border-l lg:border-white lg:pl-8">
          <h4 className="font-bold text-base mb-2">Follow</h4>
          <p className="text-sm text-neutral-400 mb-4">Connect with us on our social channels</p>
          <div className="flex items-center gap-3">
            {socials.map((item, i) => (
              <a key={i} href={item.href} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#00FFFF] transition-colors"><item.icon size={15} /></a>
            ))}
          </div>
        </div>
      </div>



      <div className="w-full lg:h-[60vh] flex items-end justify-center overflow-hidden select-none">
        <p className="text-[#383838] font-serif leading-[0.7] translate-y-[8%]" style={{ fontSize: "40vw" }}>one8</p>
      </div>
    </footer>
  );
}