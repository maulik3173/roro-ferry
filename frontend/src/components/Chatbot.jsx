import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

// Dictionary of common words related to ferry services
const dictionary = {
    "ticket": ["ticket", "tiket", "tickit", "tickt"],
    "booking": ["booking", "bokking", "boking", "bookin"],
    "schedule": ["schedule", "scedule", "scedul", "skedule"],
    "price": ["price", "pryce", "pric", "prize"],
    "food": ["food", "fud", "fod", "fud"],
    "safety": ["safety", "safty", "saftey", "safte"],
    "amenities": ["amenities", "amenitys", "amenitis", "amenites"],
    "documents": ["documents", "documnts", "documets", "documents"],
    "contact": ["contact", "kontact", "contakt", "kontakt"],
    "parking": ["parking", "parkin", "parkng", "parkig"],
    "operation": ["operation", "operatin", "operashun", "operashn"],
    "information": ["information", "informaton", "informashun", "informashn"],
    "agent": ["agent", "ajent", "agnt", "ajnt"],
    "hello": ["hello", "helo", "hlo", "hllo"],
    "help": ["help", "hlp", "helpp", "hel"],
    "location": ["location", "locatin", "lokation", "lokashun"],
    "direction": ["direction", "direktion", "direkshun", "direksn"],
    "menu": ["menu", "menue", "menyu", "men"],
    "payment": ["payment", "paymnt", "paymet", "paymnt"],
    "refund": ["refund", "refnd", "refundd", "refnd"],
    "cancellation": ["cancellation", "cancelation", "cancellashun", "cancelashn"],
    "terminal": ["terminal", "termnal", "terminl", "termnl"],
    "boarding": ["boarding", "bording", "bordng", "boardng"],
    "ferry": ["ferry", "fery", "ferri", "ferree"],
    "route": ["route", "rout", "root", "rute"],
    "departure": ["departure", "departur", "deprture", "deparcher"],
    "arrival": ["arrival", "arival", "arrivel", "arivel"],
    "delay": ["delay", "dely", "dlay", "dellay"],
    "discount": ["discount", "discont", "discunt", "discout"],
    "offer": ["offer", "ofr", "oferr", "ofeer"],
    "group": ["group", "grop", "grup", "groop"],
    "corporate": ["corporate", "corprate", "corparate", "corprte"],
    "pets": ["pets", "pet", "petz", "petss"],
    "luggage": ["luggage", "lugage", "luggae", "lugag"],
    "feedback": ["feedback", "feedbak", "fedback", "feedbck"],
    "complaint": ["complaint", "complain", "complint", "complent"],
    "wifi": ["wifi", "wi-fi", "wify", "wifii"],
    "entertainment": ["entertainment", "entertainmnt", "entertanment", "entrtainment"],
    "movies": ["movies", "movis", "moovies", "movess"],
    "children": ["children", "childrn", "childern", "childen"],
    "senior": ["senior", "senor", "seniorr", "senir"],
    "citizen": ["citizen", "citizin", "citisen", "citizn"],
    "weather": ["weather", "wether", "wheather", "wether"],
    "insurance": ["insurance", "insurence", "insuranc", "insurans"],
    "passport": ["passport", "pasport", "passprt", "pasprt"],
    "id": ["id", "identity", "identification", "i.d."]
};

const Chatbot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [hasShownWelcome, setHasShownWelcome] = useState(false);
    const [suggestions, setSuggestions] = useState([
        "Booking", "Food", "Direction", "Safety", "Amenities", 
        "Documents", "Contact", "Parking", "Other", "Operations", 
        "Information", "Agent"
    ]);
    const [pendingCorrection, setPendingCorrection] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [scheduleData, setScheduleData] = useState(null);

    // Function to simulate typing delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Function to add message with character-by-character typing animation
    const addMessageWithTyping = async (message, isUser = false) => {
        if (isUser) {
            setChatMessages(prev => [...prev, { text: message, isUser: true }]);
            return;
        }

        setIsTyping(true);
        await delay(1000); // Initial delay before showing typing indicator

        // Create a temporary message for character-by-character display
        let currentMessage = "";
        const characters = message.split('');
        
        // Add message to chat with empty text initially
        setChatMessages(prev => [...prev, { text: "", isUser: false }]);

        // Type each character with a delay
        for (let i = 0; i < characters.length; i++) {
            currentMessage += characters[i];
            setChatMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { text: currentMessage, isUser: false };
                return newMessages;
            });
            
            // Random delay between 20-50ms for each character
            await delay(Math.random() * 30 + 20);
        }

        setIsTyping(false);
    };

    const handleCorrectionResponse = async (userMessage) => {
        const message = userMessage.toLowerCase();
        
        if (message.includes('yes') || message.includes('correct') || message.includes('ok')) {
            let correctedMessage = pendingCorrection.originalMessage;
            pendingCorrection.corrections.forEach((corr, index) => {
                correctedMessage = correctedMessage.replace(
                    new RegExp(pendingCorrection.misspelledWords[index], 'gi'),
                    corr
                );
            });

            await addMessageWithTyping(correctedMessage, true);
            await generateResponse(correctedMessage);
            setSuggestions(getSuggestions(correctedMessage));
        } else if (message.includes('no') || message.includes('wrong')) {
            await addMessageWithTyping(pendingCorrection.originalMessage, true);
            await generateResponse(pendingCorrection.originalMessage);
            setSuggestions(getSuggestions(pendingCorrection.originalMessage));
        } else {
            await addMessageWithTyping("I'm not sure if you want to use the corrections. Please respond with 'yes' or 'no'.", false);
            return;
        }

        setPendingCorrection(null);
        setMessage("");
    };

    const sendMessage = async (userMessage) => {
        if (userMessage.trim()) {
            if (pendingCorrection) {
                await handleCorrectionResponse(userMessage);
                return;
            }

            const { misspelledWords, corrections } = checkSpelling(userMessage);
            
            if (misspelledWords.length > 0) {
                // Automatically correct the message
                let correctedMessage = userMessage;
                misspelledWords.forEach((word, index) => {
                    correctedMessage = correctedMessage.replace(
                        new RegExp(word, 'gi'),
                        corrections[index]
                    );
                });
                
                // Send the corrected message
                await addMessageWithTyping(correctedMessage, true);
                setMessage("");
                await generateResponse(correctedMessage);
                setSuggestions(getSuggestions(correctedMessage));
                return;
            }

            await addMessageWithTyping(userMessage, true);
            setMessage("");
            await generateResponse(userMessage);
            setSuggestions(getSuggestions(userMessage));
        }
    };

    const fetchScheduleData = async (type, params) => {
        try {
            let response;
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of day

            if (type === 'all') {
                response = await axios.get('http://localhost:5000/api/get-schedules');
                // Filter future schedules
                const futureSchedules = response.data.filter(schedule => 
                    new Date(schedule.departureDate) >= today
                );
                return futureSchedules;
            } else if (type === 'one-way') {
                // Ensure departure date is in the future
                if (params.departureDate) {
                    const departureDate = new Date(params.departureDate);
                    if (departureDate < today) {
                        return []; // Return empty array if date is in past
                    }
                }
                response = await axios.get('http://localhost:5000/api/one-way', { params });
                return response.data;
            } else if (type === 'round-trip') {
                // Ensure return date is in the future
                if (params.returnDate) {
                    const returnDate = new Date(params.returnDate);
                    if (returnDate < today) {
                        return [];
                    }
                }
                response = await axios.get('http://localhost:5000/api/round-trip', { params });
                return response.data;
            } else {
                response = await axios.get('http://localhost:5000/api/get-schedules');
                // Filter future schedules
                const futureSchedules = response.data.filter(schedule => 
                    new Date(schedule.departureDate) >= today
                );
                return futureSchedules;
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            return null;
        }
    };

    const generateResponse = async (userMessage) => {
        let response = "I'm here to help!";
        const message = userMessage.toLowerCase();

        if (message.includes("ticket") || message.includes("book")) {
            response = "You can book tickets for our ferry services online or at our terminals. We offer routes connecting Mumbai, Chennai, Kochi, and the Andaman Islands. Would you like assistance with booking?";
        } else if (message.includes("hello") || message.includes("hi")) {
            response = "Namaste! Welcome to RORO Ferry Services. We are here to make your journey across the Indian Ocean smooth and enjoyable. How can I assist you today?";
        } else if (message.includes("help")) {
            response = "Sure! I can help you with:\n- Booking tickets\n- Checking ferry schedules\n- Information about onboard amenities\n- Safety guidelines\n- Parking facilities\nWhat do you need assistance with?";
        } else if (message.includes("hours") ) {
            if (message.includes("food") || message.includes("service")) {
                response = "Our onboard food service is available during the following hours:\n- Breakfast: 6:00 AM to 10:00 AM\n- Lunch: 12:00 PM to 3:00 PM\n- Dinner: 7:00 PM to 10:00 PM\n- Snacks and beverages are available 24/7\nWould you like to know more about our menu options?";
            } else {
                response = "Our ferries operate daily from 6:00 AM to 10:00 PM. For routes to the Andaman Islands, we recommend checking the weekly schedule. Would you like to know the timings for a specific route?";
            }
        } else if (message.includes("operation") || message.includes("status")) {
            response = "Our ferry operations run from 6:00 AM to 10:00 PM daily. During this time, we maintain regular departures every 2 hours. For real-time status updates or specific route information, please let me know which route you're interested in.";
        } else if (message.includes("location") || message.includes("direction")) {    
            response = "Our terminals are located in Mumbai (Gateway of India), Chennai (Marina Beach), and Kochi (Marine Drive). We also connect to the Andaman and Lakshadweep Islands. Would you like directions to a specific terminal?";
        } else if (message.includes("contact")) {
            response = "You can contact us via:\n- Phone: +91 98765 43210\n- Email: support@roroferry.in\n- WhatsApp: +91 98765 43210\nOur support team is available from 6:00 AM to 10:00 PM.";
        } else if (message.includes("food") || message.includes("menu")) {
            response = "Our onboard menu includes:\n- Veg Thali: ₹250\n- Chicken Biryani: ₹300\n- Masala Dosa: ₹150\n- Tea/Coffee: ₹50\n- Fresh Juice: ₹100\nWould you like to pre-order your meal?";
        } else if (message.includes("safety")) {
            response = "We prioritize your safety with:\n- Life jackets for all passengers\n- Emergency evacuation drills\n- Onboard medical kits\n- Weather monitoring systems\nWould you like to know more about our safety measures?";
        } else if (message.includes("amenities")) {
            response = "Our ferries offer:\n- Comfortable seating\n- Free WiFi\n- Charging points\n- Clean restrooms\n- Entertainment options\nWould you like to know more about any specific amenity?";
        } else if (message.includes("documents")) {
            response = "For travel, please carry:\n- A valid ID (Aadhaar, Passport, or Driving License)\n- Booking confirmation\n- Travel permits (if applicable)\nWould you like help with document verification?";
        } else if (message.includes("parking")) {
            response = "We provide secure parking at all terminals:\n- Short-term parking: ₹50/hour\n- Long-term parking: ₹300/day\n- 24/7 security\nWould you like to reserve a parking spot?";
        } else if (message.includes("payment") || message.includes("price")) {
            response = "Our ticket prices (in INR):\n- Economy: ₹400\n- Business: ₹600\n- Premium: ₹800\nWe accept UPI, net banking, and all major credit/debit cards. Would you like to proceed with payment?";
        } else if (message.includes("cancellation") || message.includes("refund")) {
            response = "Cancellation policy:\n- Free cancellation up to 24 hours before departure\n- 50% refund for cancellations within 12-24 hours\n- No refund for cancellations within 12 hours\nWould you like to cancel your ticket?";
        } else if (message.includes("weather")) {
            response = "Today's weather is clear and suitable for ferry operations. In case of severe weather, we will notify you of any delays. Would you like weather updates for your travel date?";
        } else if (message.includes("discount") || message.includes("offer")) {
            response = "We offer discounts for:\n- Children under 12: 50% off\n- Senior citizens: 20% off\n- Group bookings: Special rates\nWould you like to know more about our offers?";
        } else if (message.includes("group") || message.includes("corporate")) {
            response = "We provide group and corporate packages with:\n- Discounted rates\n- Priority boarding\n- Customizable services\nWould you like to speak to our group booking specialist?";
        } else if (message.includes("pets") || message.includes("animals")) {
            response = "Pets are welcome onboard under these conditions:\n- Must be in carriers or on a leash\n- Owners are responsible for their care\nWould you like to know more about our pet policy?";
        } else if (message.includes("luggage") || message.includes("baggage")) {
            response = "Each passenger is allowed:\n- 1 carry-on bag (up to 7kg)\n- 1 checked bag (up to 20kg)\nAdditional luggage may incur extra charges. Would you like to know more about our luggage policy?";
        } else if (message.includes("feedback") || message.includes("complaint")) {
            response = "We value your feedback! Please share your experience or file a complaint via:\n- Email: feedback@roroferry.in\n- Phone: +91 98765 43210\nHow can we assist you further?";
        } else if (message.includes("wifi") || message.includes("internet")) {
            response = "We provide free WiFi onboard. Please note that connectivity may vary depending on the route. Would you like assistance with connecting to the WiFi?";
        } else if (message.includes("entertainment") || message.includes("movies")) {
            response = "Our ferries feature:\n- Movies\n- Music\n- Games\nYou can also bring your own devices. Would you like to know more about our entertainment options?";
        } else if (message.includes("schedule") || message.includes("timing")) {
            try {
                // Extract date from message if present
                const dateMatch = message.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}/i);
                let scheduleData;
                
                if (dateMatch) {
                    // Convert the matched date to a proper format
                    const dateStr = dateMatch[0];
                    const date = new Date(dateStr);
                    
                    if (isNaN(date.getTime())) {
                        await addMessageWithTyping("I couldn't understand the date format. Please provide the date in DD/MM/YYYY format.", false);
                        return;
                    }

                    // Format date for API
                    const formattedDate = date.toISOString().split('T')[0];
                    scheduleData = await fetchScheduleData('one-way', { departureDate: formattedDate });
                } else {
                    scheduleData = await fetchScheduleData();
                }
                
                if (scheduleData && scheduleData.length > 0) {
                    response = "📅 FERRY SCHEDULES 📅\n" + 
                              "══════════════════════\n\n";
                    
                    // Group schedules by route
                    const routeGroups = {};
                    scheduleData.forEach(schedule => {
                        const route = `${schedule.from}-${schedule.to}`;
                        if (!routeGroups[route]) {
                            routeGroups[route] = [];
                        }
                        routeGroups[route].push(schedule);
                    });

                    // Display schedules by route
                    Object.entries(routeGroups).forEach(([route, schedules]) => {
                        const [from, to] = route.split('-');
                        response += `🚢 ${from.toUpperCase()} ⟶ ${to.toUpperCase()}\n`;
                        response += `--------------------\n`;
                        
                        schedules.forEach(schedule => {
                            // Format date
                            const date = new Date(schedule.departureDate);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                            });

                            // Format status with emoji
                            const statusEmoji = schedule.onwardStatus === "scheduled" ? "🟢" : "🔵";
                            
                            response += `📆 Date: ${formattedDate}\n`;
                            response += `⏰ Time: ${schedule.arrivalTime}\n`;
                            response += `🎫 Type: ${schedule.tripType === "round-trip" ? "Round Trip 🔄" : "One Way ➡️"}\n`;
                            response += `${statusEmoji} Status: ${schedule.onwardStatus.charAt(0).toUpperCase() + schedule.onwardStatus.slice(1)}\n`;

                            // Add return info if round trip
                            if (schedule.tripType === "round-trip" && schedule.returnDate) {
                                const returnDate = new Date(schedule.returnDate);
                                const formattedReturnDate = returnDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                });
                                response += `🔄 Return: ${formattedReturnDate} at ${schedule.returnTime}\n`;
                            }
                            
                            response += `\n`;
                        });
                        response += `\n`;
                    });

                    // Add summary footer
                    response += "════════ SUMMARY ════════\n";
                    response += `📊 Total Routes: ${Object.keys(routeGroups).length}\n`;
                    response += `🎫 Total Schedules: ${scheduleData.length}\n\n`;
                    
                    if (dateMatch) {
                        response += `📅 Showing schedules for ${dateMatch[0]}\n`;
                    }
                    
                    response += "Need specific route information?\nJust ask! 😊";

                    // Add booking link
                    response += `🔗 [Book your ferry ticket here!] <a href="http://localhost:5173/ticket" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">Click here</a>`;

                } else {
                    if (dateMatch) {
                        response = `📢 SCHEDULE UPDATE\n` +
                                  `══════════════════\n\n` +
                                  `No schedules available for ${dateMatch[0]}.\n` +
                                  `Please try a different date or contact our support team.\n\n` +
                                  `☎️ Support: +91 98765 43210\n` +
                                  `📧 Email: support@roroferry.in` +
                                  `🔗 [Book your ferry ticket here!] <a href="http://localhost:5173/ticket" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">Click here</a>`
                    } else {
                        response = "📢 SCHEDULE UPDATE\n" +
                                  "══════════════════\n\n" +
                                  "No schedules are currently available.\n" +
                                  "Please check back later or contact our support team for assistance.\n\n" +
                                  "☎️ Support: +91 98765 43210\n" +
                                  "📧 Email: support@roroferry.in" +
                                  `🔗 [Book your ferry ticket here!] <a href="http://localhost:5173/ticket" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">Click here</a>`;
                    }
                }
            } catch (error) {
                console.error('Error in schedule response:', error);
                response = "⚠️ SYSTEM NOTIFICATION ⚠️\n" +
                          "═══════════════════════\n\n" +
                          "Unable to fetch schedule information at the moment.\n" +
                          "Please try again later or contact support.\n\n" +
                          "🔧 Our team is working to resolve this issue.";
            }
        } else if (message.includes("passport")) {
            response = "For domestic ferry routes within India, a government-issued photo ID (such as Aadhaar, Voter ID, or Driving License) is sufficient. However, for international routes or travel to certain islands, a valid passport may be required. Please check the specific route requirements or contact our support for detailed information.";
        } else {
            response = "I'm here to help! Could you please provide more details about what you'd like to know? I can assist you with booking, schedules, safety information, amenities, and more.";
        }

        await addMessageWithTyping(response, false);
    };

    const getSuggestions = (userMessage) => {
        const message = userMessage.toLowerCase();
        if (message.includes("ticket") || message.includes("book")) {
            return ["Booking Process", "Payment Methods", "Schedule", "Cancellation", "Refund Policy"];
        } else if (message.includes("food")) {
            return ["Menu", "Prices", "Special Requests", "Dietary Restrictions", "Food Service Hours"];
        } else if (message.includes("direction") || message.includes("location")) {
            return ["Terminal Location", "Route Map", "Landmarks", "Transportation", "Parking"];
        } else if (message.includes("safety")) {
            return ["Safety Guidelines", "Emergency Procedures", "Life Jackets", "First Aid", "Weather Conditions"];
        } else if (message.includes("amenities")) {
            return ["Restrooms", "Seating", "Entertainment", "WiFi", "Charging Stations"];
        } else if (message.includes("documents")) {
            return ["Required IDs", "Booking Confirmation", "Travel Permits", "Insurance", "Passport Requirements"];
        } else if (message.includes("contact")) {
            return ["Customer Service", "Emergency Contact", "Social Media", "Email Support", "Phone Numbers"];
        } else if (message.includes("parking")) {
            return ["Parking Rates", "Long-term Parking", "Parking Location", "Shuttle Service", "Security"];
        } else if (message.includes("operation")) {
            return ["Operating Hours", "Schedule Changes", "Maintenance", "Delays", "Service Status"];
        }
        return ["Booking", "Food", "Direction", "Safety", "Amenities", "Documents", "Contact", "Parking", "Other", "Operations", "Information", "Agent"];
    };

    // Function to check spelling and suggest corrections
    const checkSpelling = (message) => {
        const words = message.toLowerCase().split(' ');
        const misspelledWords = [];
        const corrections = [];

        words.forEach(word => {
            let found = false;
            for (const [correct, variations] of Object.entries(dictionary)) {
                if (variations.includes(word)) {
                    found = true;
                    if (word !== correct) {
                        misspelledWords.push(word);
                        corrections.push(correct);
                    }
                    break;
                }
            }
        });

        return { misspelledWords, corrections };
    };

    return (
        <>
            {/* Chatbot Icon */}
            <motion.button 
                className='fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsChatOpen(!isChatOpen);
                    if (!isChatOpen && !hasShownWelcome) {
                        addMessageWithTyping("Welcome to RORO Ferry Services! I'm your virtual assistant. How can I help you today? 😊", false);
                        setHasShownWelcome(true);
                    }
                }}
            >
                <FaRobot size={28} />
            </motion.button>

            {/* Chatbox */}
            {isChatOpen && (
                <motion.div 
                    className='fixed bottom-24 right-6 w-96 h-[600px] bg-white z-50 shadow-2xl rounded-2xl flex flex-col overflow-hidden'
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Speech bubble pointer */}
                    <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white transform rotate-45 z-10"></div>
                    
                    {/* Chat Header */}
                    <div className='flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-2xl'>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                                <FaRobot size={20} />
                            </div>
                            <h3 className='text-xl font-semibold'>Rorobot Assistant</h3>
                        </div>
                        <button 
                            className='text-white hover:text-gray-200 transition-colors duration-200'
                            onClick={() => setIsChatOpen(false)}
                        >
                            ✖
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className='flex-1 overflow-auto p-4 bg-gray-50'>
                        <div className='space-y-4'>
                            {chatMessages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                                    {!msg.isUser && (
                                        <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center'>
                                            <FaRobot size={16} className='text-white' />
                                        </div>
                                    )}
                                    <div className={`p-3 rounded-2xl shadow-sm max-w-[80%] ${msg.isUser ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-white'}`}>
                                        {msg.text.includes('<a ') ? (
                                            <span
                                                className={msg.isUser ? 'text-white' : 'text-gray-700'}
                                                dangerouslySetInnerHTML={{ __html: msg.text }}
                                            />
                                        ) : (
                                            <p className={msg.isUser ? 'text-white' : 'text-gray-700'}>
                                                {msg.text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className='flex items-start gap-3'>
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center'>
                                        <FaRobot size={16} className='text-white' />
                                    </div>
                                    <div className='bg-white p-3 rounded-2xl shadow-sm'>
                                        <div className='flex space-x-2'>
                                            <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                                            <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                                            <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Suggestion Buttons */}
                        <div className='flex flex-wrap gap-2 mt-6'>
                            {suggestions.map((category) => (
                                <button 
                                    key={category} 
                                    className='bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 border border-blue-200 transition-all duration-200 hover:shadow-md text-sm font-medium'
                                    onClick={() => sendMessage(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className='flex items-center border-t p-4 bg-white'>
                        <input 
                            type='text' 
                            className='flex-1 p-3 border border-gray-200 rounded-l-full focus:outline-none focus:border-blue-500 transition-colors duration-200' 
                            placeholder='Type your message...' 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage(message)}
                        />
                        <button 
                            className='p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-r-full hover:bg-blue-700 transition-all duration-200 hover:shadow-md'
                            onClick={() => sendMessage(message)}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default Chatbot; 