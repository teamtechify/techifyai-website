'use client'

import { ButtonMainSmall, ButtonShade } from "../buttons/buttons"
import './nav.css';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowUpLong, FaBars, FaX } from "react-icons/fa6";
import { MouseEventHandler, useState } from "react";
import { BookFormComponent } from "../form/book";

type LinkHoverTextProps = {
  text: string;
};

export const LinkHoverText: React.FC<LinkHoverTextProps> = ({ text }) => {
    const letters = text.split('');
  
    return (
      <span className="hover-text-container">
        {/* Invisible static text for sizing */}
        <span className="uppercase pr-[2px]" style={{ visibility: 'hidden' }}>{text}</span>
        <span className="text-layer top">
          {letters.map((char, i) => (
            <span
              className="char"
              style={{ transitionDelay: `${i * 0.03}s` }}
              key={`top-${i}`}
            >
              {char}
            </span>
          ))}
        </span>
        <span className="text-layer bottom">
          {letters.map((char, i) => (
            <span
              className="char"
              style={{ transitionDelay: `${i * 0.03}s` }}
              key={`bottom-${i}`}
            >
              {char}
            </span>
          ))}
        </span>
      </span>
    );
};

const ScrollBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth' // optional for smooth scrolling
  });
}

const NavArray = [
    {
      name: 'home',
      href: '/'
    },
    {
      name: 'chat',
      onclick: ScrollBottom
    },
    // {
    //   name: 'speak',
    //   onclick: ScrollBottom
    // },
]

interface NavItemType {
    name: string,
    href?: string,
    onclick?: MouseEventHandler<HTMLDivElement>
}

export const NavItem = ({data, active}:{data: NavItemType, active?: boolean}) => {
    if(data.href) {
      return(
        <Link href={data.href}>
          <div className={`flex items-center gap-1 ${active ? 'bg-white text-black' : 'text-white'}`}>
              <div className={`text-[13px] text-white ${active && 'opacity-0'}`}>&#91;</div>
              <LinkHoverText text={data.name} />
              <div className={`text-[13px] text-white ${active && 'opacity-0'}`}>&#93;</div>
          </div>
        </Link>
      )
    }
    if(data.onclick) {
      return(
        <div onClick={data.onclick} className={`flex items-center gap-1 ${active ? 'bg-white text-black' : 'text-white'}`}>
            <div className={`text-[13px] text-white ${active && 'opacity-0'}`}>&#91;</div>
            <LinkHoverText text={data.name} />
            <div className={`text-[13px] text-white ${active && 'opacity-0'}`}>&#93;</div>
        </div>
      )
    }
    
}

export const NavComponent = () => {
    const pathname = usePathname()
    const [popup, setPopup] = useState(false)
    const [booking, setBooking] = useState(false)

    const Book = () => {
      setBooking(true)
      setPopup(false)
    }
    
    return(
        <nav className="flex items-center justify-between py-6 px-8 fixed top-0 left-0 w-full z-50 bg-[rgba(0,0,0,.6)] lg:bg-[rgba(0,0,0,.3)]">
            <div className="flex items-center gap-8">
                <Link href="/">
                  <div className="text-white uppercase">
                    {"<A.I>"}
                  </div>
                </Link>
                <div className="hidden lg:flex items-center gap-8">
                    {NavArray.map((item, itemkey) => <NavItem active={item.href === pathname} key={`NavComponent-NavItem-${itemkey}`} data={item} />)}
                </div>
            </div>
            <div className="hidden lg:flex items-center gap-4">
                <ButtonMainSmall onClick={() => setBooking(true)}>BOOK A CALL <FaArrowUpLong /></ButtonMainSmall>
            </div>
            <div className="lg:hidden text-white text-2xl" onClick={() => setPopup(!popup)}>
              {/* @ts-ignore */}
              <FaBars />
            </div>
            <div className={`lg:hidden ${popup ? 'opacity-100' : 'opacity-0 pointer-events-none'} gap-12 flex-col flex duration-300 transition-all bg-black p-4 absolute top-0 left-0 w-full h-screen z-50`}>
              <div className="flex flex-col gap-4 w-1/2">
                  {NavArray.map((item, itemkey) => <NavItem active={item.href === pathname} key={`NavComponent-NavItem-${itemkey}`} data={item} />)}
              </div>
              <div className="flex items-center w-full justify-center gap-4 mt-4">
                <ButtonMainSmall onClick={() => Book()} full>BOOK A CALL <FaArrowUpLong /></ButtonMainSmall>
              </div>
              <div className="absolute top-4 right-4 text-white text-xl" onClick={() => setPopup(!popup)}>
                {/* @ts-ignore */}
                <FaX />
              </div>
            </div>
            {booking && <BookFormComponent close={() => setBooking(false)} />}
        </nav>
    )
}
