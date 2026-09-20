import "./footer.scss";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <p className="site-footer__logo">Turo</p>
          <p className="site-footer__lead">
            Маршруты от гидов и путешественников. Вы выбираете. Или придумываете
            сами.
          </p>
        </div>
        <div>
          <p className="site-footer__label">Платформа</p>
          <a href="#tours">Каталог туров</a>
          <a href="#create">Создать тур</a>
          <a href="#how">Как это работает</a>
        </div>
        <div>
          <p className="site-footer__label">Аккаунт</p>
          <Link href="#auth">Войти</Link>
          <Link href="#auth">Регистрация</Link>
          <Link href="#auth">Мои брони</Link>
        </div>
        <div>
          <p className="site-footer__label">Контакт</p>
          <a href="mailto:hello@turo.travel">hello@turo.travel</a>
          <p>Пн–Вс, 10:00–21:00</p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Turo</span>
        <span>Минимально. Честно. В дороге.</span>
      </div>
    </footer>
  );
}
