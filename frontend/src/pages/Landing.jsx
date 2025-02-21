import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hover, motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowRight,
  Dumbbell,
  Heart,
  Brain,
  Instagram,
  Twitter,
  Facebook,
  Mail,
} from "lucide-react";

const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The hard days are what make you stronger.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The body achieves what the mind believes.",
  "Sweat is just fat crying.",
  "The difference between try and triumph is a little umph.",
  "Your health is an investment, not an expense.",
];

const Landing = ({ isAuthenticated, darkMode }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const quoteRef = useRef(null);
  const servicesRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [quote, setQuote] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);

  const statsControls = useAnimation();
  const quoteControls = useAnimation();
  const servicesControls = useAnimation();

  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });
  const isQuoteInView = useInView(quoteRef, { once: false, amount: 0.5 });
  const isServicesInView = useInView(servicesRef, { once: false, amount: 0.3 });

  const handleProtectedNavigate = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (!navbar) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          navbar.style.transform = "translateY(-100%)";
        } else {
          navbar.style.transform = "translateY(0)";
        }
      } else {
        navbar.style.transform = "translateY(0)";
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isStatsInView) {
      statsControls.start("visible");
    }
    if (isQuoteInView) {
      quoteControls.start("visible");
    }
    if (isServicesInView) {
      servicesControls.start("visible");
    }
  }, [
    isStatsInView,
    isQuoteInView,
    isServicesInView,
    statsControls,
    quoteControls,
    servicesControls,
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor(effect) {
        this.effect = effect;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.radius = Math.random() * 3 + 1;
        this.color = darkMode
          ? `rgba(100, 150, 255, ${Math.random() * 0.3 + 0.2})`
          : `rgba(70, 130, 180, ${Math.random() * 0.3 + 0.2})`;
      }

      draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.effect.width || this.x < 0) this.speedX *= -1;
        if (this.y > this.effect.height || this.y < 0) this.speedY *= -1;
      }
    }

    class Effect {
      constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = Math.floor((this.width * this.height) / 15000);
        this.createParticles();

        this.waveFrequency = 0.01;
        this.waveAmplitude = 50;
        this.hue = darkMode ? 210 : 200;
        this.wavePhase = 0;
      }

      createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
          this.particles.push(new Particle(this));
        }
      }

      handleParticles(context) {
        this.particles.forEach((particle) => {
          particle.draw(context);
          particle.update();
        });
      }

      drawWaves(context) {
        context.strokeStyle = darkMode
          ? "rgba(100, 150, 255, 0.2)"
          : "rgba(70, 130, 180, 0.2)";
        this.wavePhase += 0.01;

        for (let i = 0; i < 3; i++) {
          const offsetY = i * 70;
          const amplitude = this.waveAmplitude - i * 10;
          const frequency = this.waveFrequency + i * 0.002;

          context.beginPath();
          context.lineWidth = 2;

          for (let x = 0; x < this.width; x++) {
            const y =
              amplitude * Math.sin(x * frequency + this.wavePhase + i) +
              this.height * 0.6 +
              offsetY;

            if (x === 0) {
              context.moveTo(x, y);
            } else {
              context.lineTo(x, y);
            }
          }
          context.stroke();
        }
      }

      render(context) {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        const gradient = context.createLinearGradient(0, 0, 0, this.height);
        if (darkMode) {
          gradient.addColorStop(0, "rgba(30, 41, 59, 1)");
          gradient.addColorStop(1, "rgba(15, 23, 42, 1)");
        } else {
          gradient.addColorStop(0, "rgba(219, 234, 254, 1)");
          gradient.addColorStop(1, "rgba(196, 219, 249, 1)");
        }
        context.fillStyle = gradient;
        context.fillRect(0, 0, this.width, this.height);

        this.drawWaves(context);
        this.handleParticles(context);
      }
    }

    const effect = new Effect(canvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      effect.render(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [darkMode]);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const heroVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: 0.15,
        staggerChildren: 0.15,
      },
    },
  };

  const heroItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const headingVariants = {
    initial: { opacity: 0, x: -50 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.15,
      },
    }),
  };

  const quoteVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const serviceCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.15,
      },
    }),
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      backgroundColor: darkMode ? "#2563eb" : "#2563eb",
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const arrowVariants = {
    initial: { x: 0 },
    hover: {
      x: 5,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.6,
      },
    },
  };

  return (
    <div className={`landing-page ${darkMode ? "dark" : ""}`}>
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        <div className="container mx-auto px-6 z-10 relative">
          <motion.div
            className="max-w-3xl"
            initial="initial"
            animate="animate"
            variants={heroVariants}
          >
            <motion.h1
              variants={headingVariants}
              className={`main-h1 text-5xl md:text-6xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Transform Your Body,
              <br /> Transform Your Life
            </motion.h1>
            <motion.p
              variants={heroItemVariants}
              className={`text-xl md:text-2xl mb-8 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Join FLEX-IT-OUT, the AI-powered fitness platform that gives you
              real-time feedback and personalized workout plans.
            </motion.p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleProtectedNavigate("/exercises")}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg flex items-center group"
            >
              Start Your Journey
              <motion.span
                className="ml-2"
                variants={arrowVariants}
                initial="initial"
                whileHover="hover"
              >
                <ArrowRight />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section
        ref={statsRef}
        className={`py-20 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="container mx-auto px-6">
          <h2
            className={`text-3xl font-bold text-center mb-16 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why People Choose FLEX-IT-OUT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "10,000+",
                subtitle: "Active Users",
                description:
                  "Join our growing community of fitness enthusiasts who are achieving their goals.",
                icon: (
                  <Heart
                    size={40}
                    className={darkMode ? "text-red-400" : "text-red-500"}
                  />
                ),
                color: darkMode ? "bg-red-900/20" : "bg-red-50",
              },
              {
                title: "98%",
                subtitle: "Form Accuracy",
                description:
                  "Our AI technology ensures you're performing exercises with proper technique.",
                icon: (
                  <Dumbbell
                    size={40}
                    className={darkMode ? "text-blue-400" : "text-blue-500"}
                  />
                ),
                color: darkMode ? "bg-blue-900/20" : "bg-blue-50",
              },
              {
                title: "30%",
                subtitle: "Better Results",
                description:
                  "Users report 30% better results compared to traditional workout methods.",
                icon: (
                  <Brain
                    size={40}
                    className={darkMode ? "text-green-400" : "text-green-500"}
                  />
                ),
                color: darkMode ? "bg-green-900/20" : "bg-green-50",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`stat-card p-8 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } shadow-md`}
                custom={index}
                initial="hidden"
                animate={statsControls}
                variants={statCardVariants}
                whileHover={{
                  boxShadow: darkMode
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
                    : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  scale: 1.02,
                  y: 1,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.color}`}
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      duration: 0.2,
                      repeat: 1,
                      repeatType: "reverse",
                    },
                  }}
                >
                  {stat.icon}
                </motion.div>
                <h3
                  className={`text-3xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.title}
                </h3>
                <h4
                  className={`text-xl font-semibold mb-4 ${
                    darkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {stat.subtitle}
                </h4>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={quoteRef}
        className={`py-16 ${darkMode ? "bg-blue-900" : "bg-blue-50"}`}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.blockquote
            className="max-w-3xl mx-auto"
            initial="hidden"
            animate={quoteControls}
            variants={quoteVariants}
          >
            <p
              className={`text-2xl md:text-3xl italic font-medium mb-6 ${
                darkMode ? "text-blue-100" : "text-blue-800"
              }`}
            >
              "{quote}"
            </p>
          </motion.blockquote>
        </div>
      </section>

      <section
        ref={servicesRef}
        className={`py-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-6">
          <h2
            className={`text-3xl font-bold text-center mb-16 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Workout Analysis",
                description:
                  "Get real-time feedback on your form and technique during exercises.",
                path: "/exercises",
              },
              {
                title: "Personalized Challenges",
                description:
                  "Join challenges tailored to your fitness level and goals.",
                path: "/challenges",
              },
              {
                title: "Community Leaderboard",
                description:
                  "Track your progress and compete with friends to stay motivated.",
                path: "/leaderboard",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className={`service-card rounded-xl overflow-hidden shadow-md cursor-pointer ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
                onClick={() => handleProtectedNavigate(service.path)}
                custom={index}
                initial="hidden"
                animate={servicesControls}
                variants={serviceCardVariants}
                whileHover={{
                  boxShadow: darkMode
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
                    : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="p-8">
                  <h3
                    className={`text-xl font-bold mb-4 group-hover:text-blue-500 transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mb-6 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {service.description}
                  </p>
                  <motion.div
                    className={`flex items-center font-medium ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                    whileHover={{ x: 3 }}
                  >
                    Learn More
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 1.5,
                        repeatDelay: 1,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer
        className={`py-12 ${
          darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-800 text-gray-300"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">FLEX-IT-OUT</h3>
              <p className="mb-4">Transforming fitness through technology</p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Twitter size={20} />
                </motion.a>
                <motion.a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Facebook size={20} />
                </motion.a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-md font-semibold mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => handleProtectedNavigate("/home")}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Home
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => handleProtectedNavigate("/profile")}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Profile
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => handleProtectedNavigate("/challenges")}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Challenges
                  </motion.button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-md font-semibold mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    FAQ
                  </motion.a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-md font-semibold mb-4">
                Contact Us
              </h4>
              <p className="flex items-center mb-2">
                <Mail size={16} className="mr-2" />
                support@flexitout.com
              </p>
              <p>© 2025 FLEX-IT-OUT. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        nav {
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Landing;
