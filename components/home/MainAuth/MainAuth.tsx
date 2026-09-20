import "./MainAuth.scss";
import { Button } from "@/components/ui";

export function MainAuth() {
  return (
    <section className="main-auth" id="auth">
      <div>
        <h2 className="main-auth__title">Войти и поехать</h2>
        <p className="main-auth__text">
          Регистрация нужна и чтобы записаться, и чтобы опубликовать свой
          маршрут. Никакого шума в ленте — только ваши поездки.
        </p>
      </div>
      <div className="main-auth__actions">
        <Button variant="cta" size="lg">
          Создать аккаунт
        </Button>
        <Button variant="outline" size="lg">
          У меня уже есть
        </Button>
      </div>
    </section>
  );
}
