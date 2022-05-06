
export default function Footer() {
    return (
        <div className='container-fluid p-12 mx-auto flex items-center justify-between h-full text-white gap-7'>
            <div className='w-full text-sm text-[#404C55]' >
                © 2022 Sigmadex Foundation
            </div>
            <ul className="flex flex-row gap-5">
                <li className = "text-sm text-[#404C55]">
                    154869129
                </li>
                <li>
                    <img className = "w-[31px]" src = "/images/footer.png" alt = "footer"/>
                </li>
            </ul>
        </div>
    )
  }
  
