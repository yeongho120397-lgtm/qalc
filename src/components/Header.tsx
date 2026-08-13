import { LanguageSwitcher } from './LanguageSwitcher'
import qalcMark from '../assets/qalc-mark.png'
import './Header.css'

export function Header() {
  return (
    <header className="header">
      <div className="header__side" aria-hidden="true" />
      <img className="header__mark" src={qalcMark} alt="QALC" />
      <div className="header__side header__side--end">
        <LanguageSwitcher />
      </div>
    </header>
  )
}
