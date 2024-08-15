import Wallet from "../components/Wallet"

const HButton = (props) => {
    return (
        <button className="text-gray-300 bg-none text-base uppercase" onClick={props.onclick}>{props.title}</button>
    )
}

const Header = () => {
    return (
        <>
            <div className="sticky top-0 z-40 bg-[#292c38]">
                <div className="flex justify-between items-center mx-20 py-1 flex-wrap">
                    <div className="flex justify-start gap-5 items-center">
                        <img src="./img/moon.png" className="h-16 w-18" />
                        <p className="text-2xl text-white">MoonSwap</p>

                    </div>
                    <div className="flex justify-end gap-5 flex-wrap">
                        <HButton title="Swap" onclick={() => { window.location.href = "/" }}/>
                        <HButton title="Token" onclick={() => { window.location.href = "/token" }}/>
                        <HButton title="Liquidity" onclick={() => { window.location.href = "/liquidity" }}/>
                        <Wallet/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header