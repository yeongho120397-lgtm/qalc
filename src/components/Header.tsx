import { LanguageSwitcher } from './LanguageSwitcher'
import qelkMark from '../assets/qelk-mark.png'
import './Header.css'

export function Header() {
  return (
    <header className="header">
      <div className="header__side header__side--start" aria-hidden="true" />
      <img className="header__mark" src={qelkMark} alt="QELK" />
      <div className="header__side header__side--end">
        <LanguageSwitcher />
      </div>
    </header>
  )
}
