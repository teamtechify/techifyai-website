"use client";
import { Fragment, MouseEventHandler, useEffect, useState } from "react";
import { HeroVideo } from "../video";
import { ButtonMain } from "../buttons/buttons";
import { FaBars, FaX } from "react-icons/fa6";

type SlotGroup = {
    [date: string]: { time: string }[];
};

export const BookFormComponent = ({ close }: { close: Function }) => {
    const [slots, setSlots] = useState<SlotGroup>({});
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bookingStatus, setBookingStatus] = useState<null | string>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [bgLoading, setBGLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => setBGLoading(false), 1500);
    }, [])

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            try {
                const start = new Date(currentDate);
                const end = new Date(currentDate);
                end.setDate(start.getDate() + 1);

                const res = await fetch(`/api/cal?startTime=${encodeURIComponent(start.toString())}&endTime=${encodeURIComponent(end.toString())}&timeZone=${encodeURIComponent(userTimeZone)}`);
                const response = await res.json();
                setSlots(response.slots);
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [currentDate, userTimeZone]);

    const bookSlot = async (slotTime: string) => {
        if (!name || !email) {
            alert("Please fill out name and email before booking.");
            return;
        }

        setBookingStatus("Booking...");

        try {
            const res = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    start: slotTime,
                    locationOption: "Virtual",
                    locationValue: "https://zoom.us/my/yourroom",
                    timeZone: userTimeZone,
                    language: "English",
                    services: "techify.xyz"
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setBookingStatus("Booking confirmed!");
                console.log("Booking successful:", data);
                setTimeout(() => {
                    close()
                }, 2000)
            } else {
                setBookingStatus("Booking failed.");
                console.error("Booking failed:", data.error || 'Unknown error'); // Log specific error message if available
                setBookingStatus(`Booking failed: ${data.error?.message || 'Please try again.'}`); // Show a more specific error if possible
            }
        } catch (err) {
            setBookingStatus("Error booking slot. Please try again later."); // Generic user message
            console.error("Error during booking API call:", err instanceof Error ? err.message : 'Unknown error'); // Log generic error message
        }
    };

    const goToPreviousDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(currentDate.getDate() - 1);
        setCurrentDate(prev);
    };

    const goToNextDay = () => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + 1);
        setCurrentDate(next);
    };

    return (
        <article className="fixed top-0 left-0 bg-black w-full z-20 h-screen overflow-auto pt-20 lg:pt-32">
            {loading ? <Fragment>
                <p className="text-white">Loading...</p>
            </Fragment>
                : <Fragment>
                    <div className={`absolute lg:top-[-100px] left-0 w-full h-full duration-500 transition-all ${bgLoading ? 'opacity-0' : 'opacity-100'}`}>
                        <HeroVideo src="2f8877f802e241bd4b51308e41e8ddd5" overlay={`bg-[rgba(0,0,0,.8)] min-h-[240px]`} />
                    </div>
                    <div className="max-w-7xl px-4 mx-auto py-8 w-full relative z-10">
                        <div className="flex justify-end">
                            <div className="text-white text-xl pr-4" onClick={() => close()}>
                                {/* @ts-ignore */}
                                <FaX />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-white block mb-1">FULL NAME*</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="p-2 bg-white/10 text-white rounded-md w-full"
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="text-white block mb-1">EMAIL ADDRESS*</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-2 bg-white/10 text-white rounded-md w-full"
                                    required
                                />
                            </div>
                        </div>

                        <label className="text-white block text-lg mb-2">BOOK A SLOT</label>
                        <div className="bg-[#0a0a0a] p-4 rounded-md space-y-6 relative">
                            <h2 className="lg:hidden text-white font-bold text-sm lg:text-lg text-center">{currentDate.toDateString()} ({userTimeZone})</h2>
                            <div className="lg:hidden flex justify-between items-center mb-12">
                                <button onClick={goToPreviousDay} className="bg-white/10 text-xs lg:text-base text-white px-4 py-2 rounded-md cursor-pointer hover:scale-105 duration-300 transition-all">Previous Day</button>
                                <button onClick={goToNextDay} className="bg-white/10 text-xs lg:text-base text-white px-4 py-2 rounded-md cursor-pointer hover:scale-105 duration-300 transition-all">Next Day</button>
                            </div>
                            <div className="hidden lg:flex justify-between items-center mb-12">
                                <button onClick={goToPreviousDay} className="bg-white/10 text-xs lg:text-base text-white px-4 py-2 rounded-md cursor-pointer hover:scale-105 duration-300 transition-all">Previous Day</button>
                                <h2 className="text-white font-bold text-sm lg:text-lg">{currentDate.toDateString()} ({userTimeZone})</h2>
                                <button onClick={goToNextDay} className="bg-white/10 text-xs lg:text-base text-white px-4 py-2 rounded-md cursor-pointer hover:scale-105 duration-300 transition-all">Next Day</button>
                            </div>
                            {Object.entries(slots).map(([date, times]) => (
                                <div key={date}>
                                    <h3 className="text-lg font-bold text-white mb-2 text-center">
                                        {new Date(date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            timeZone: userTimeZone,
                                        })}
                                    </h3>
                                    <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                                        {(times as { time: string }[]).map((slot) => (
                                            <button
                                                key={slot.time}
                                                onClick={() => bookSlot(slot.time)}
                                                className="px-3 py-1 text-base bg-black text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 py-2"
                                            >
                                                {new Date(slot.time).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {close && <div className="flex justify-center mt-8">
                            <ButtonMain onClick={close}>
                                CLOSE
                            </ButtonMain>
                        </div>}

                        {bookingStatus && (
                            <p className="text-white mt-4 font-semibold">{bookingStatus}</p>
                        )}
                    </div>
                </Fragment>}
        </article>
    );
};