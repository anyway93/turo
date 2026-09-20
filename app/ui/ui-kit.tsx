"use client";
import "./ui-kit.scss";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Wrapper } from "@/components/layout/wrapper";
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  Heart,
  Info,
  MapPin,
  Menu,
  Plane,
  Search,
  Star,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  Title,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

const palette = [
  { name: "Sand", token: "background", tone: "background" },
  { name: "Ink", token: "foreground", tone: "foreground" },
  { name: "Ocean", token: "primary", tone: "primary" },
  { name: "Sunset", token: "cta", tone: "cta" },
  { name: "Gold", token: "gold", tone: "gold" },
  { name: "Muted", token: "muted", tone: "muted" },
];

const typeSizes = [60, 48, 32, 20, 16, 14, 12] as const;
const typeColors = ["default", "muted", "primary", "cta", "gold", "destructive"] as const;

const tours = [
  {
    title: "Санторини на закате",
    place: "Греция · Киклады",
    days: 7,
    price: "89 900 ₽",
    rating: 4.9,
    tag: "Хит сезона",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Тропы Альп",
    place: "Швейцария · Интерлакен",
    days: 8,
    price: "124 000 ₽",
    rating: 4.8,
    tag: "Пеший",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b114?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Бали: рисовые террасы",
    place: "Индонезия · Убуд",
    days: 10,
    price: "97 500 ₽",
    rating: 4.7,
    tag: "Релакс",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
  },
];

const sections = [
  { id: "type", label: "Типографика" },
  { id: "palette", label: "Палитра" },
  { id: "buttons", label: "Кнопки" },
  { id: "inputs", label: "Поля" },
  { id: "cards", label: "Карточки" },
  { id: "search", label: "Поиск" },
  { id: "catalog", label: "Каталог" },
  { id: "forms", label: "Фильтры" },
  { id: "feedback", label: "Состояния" },
  { id: "overlays", label: "Окна" },
  { id: "content", label: "Контент" },
];

function Section({
  id,
  kicker,
  title,
  hint,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="kit__section">
      <div className="kit__intro">
        <Title variant={12} color="primary">
          {kicker}
        </Title>
        <Title variant={32}>{title}</Title>
        <Text variant={16} color="muted">
          {hint}
        </Text>
      </div>
      {children}
    </section>
  );
}

export function UiKit() {
  return (
    <div className="kit">
      <div className="kit__glow">
        <span />
        <span />
      </div>

      <header className="kit__header">
        <Wrapper>
        <div className="kit__bar">
          <Link href="/" className="kit__logo">
            <span className="kit__mark">
              <Compass />
            </span>
            Turo
          </Link>
          <nav className="kit__nav">
            <a href="#catalog">Туры</a>
            <a href="#search">Направления</a>
            <a href="#content">FAQ</a>
          </nav>
          <div className="kit__actions">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="button_hidden-desktop">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                  <SheetDescription>Разделы витрины</SheetDescription>
                </SheetHeader>
                <div className="sheet__body">
                  {sections.map((item) => (
                    <a key={item.id} href={`#${item.id}`}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" className="button_hidden-mobile">
              Войти
            </Button>
            <Button variant="cta">Найти тур</Button>
          </div>
        </div>
        </Wrapper>
      </header>

      <Wrapper className="kit__layout">
        <aside className="kit__aside">
          <nav className="kit__toc">
            {sections.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="kit__main">
          <div className="kit__hero">
            <Badge variant="soft">UI kit · Turo</Badge>
            <Title variant={60}>Интерфейс, в который хочется уехать</Title>
            <Text variant={20} color="muted">
              Стили на SCSS: `rem(20px)` как в finval-front. Без Tailwind.
            </Text>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Главная</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>UI-витрина</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <Section
            id="type"
            kicker="Typography"
            title="Title и Text"
            hint="variant={60 | 48 | 32 | 20 | 16 | 14 | 12}, размеры через rem()."
          >
            <Card variant="elevated">
              <CardContent className="kit__stack">
                {typeSizes.map((size) => (
                  <div key={size}>
                    <Text variant={12} color="muted">
                      Title · {size} · rem({size}px)
                    </Text>
                    <Title variant={size}>Уехать. Увидеть. Запомнить.</Title>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="kit__grid kit__grid_2">
              {typeColors.map((color) => (
                <Card key={color} variant="muted" size="sm">
                  <CardContent>
                    <Text variant={12} color="muted">
                      Text color={color}
                    </Text>
                    <Text variant={16} color={color}>
                      Авторские маршруты у моря и в горах.
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="palette" kicker="Color" title="Палитра" hint="Песок, океан и терракота.">
            <div className="kit__grid kit__grid_palette">
              {palette.map((swatch) => (
                <div key={swatch.token} className="kit__swatch">
                  <div className={`kit__swatch-tone tone_${swatch.tone}`} />
                  <div className="kit__swatch-meta">
                    <Title variant={14}>{swatch.name}</Title>
                    <Text variant={12} color="muted">
                      --{swatch.token}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="buttons" kicker="Actions" title="Кнопки" hint="Варианты и размеры на SCSS.">
            <div className="kit__row">
              <Button>Смотреть туры</Button>
              <Button variant="cta">Забронировать</Button>
              <Button variant="gold">Premium</Button>
              <Button variant="soft">Подборка</Button>
              <Button variant="secondary">В избранное</Button>
              <Button variant="outline">Сравнить</Button>
              <Button variant="glass">Glass</Button>
              <Button variant="inverse">Inverse</Button>
              <Button variant="ghost">Подробнее</Button>
              <Button variant="text">
                Все направления
                <ArrowUpRight />
              </Button>
              <Button variant="destructive">Отменить</Button>
              <Button size="icon" variant="outline">
                <Heart />
              </Button>
            </div>
            <div className="kit__row">
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="default">MD</Button>
              <Button size="lg">LG</Button>
              <Button size="xl" variant="cta">
                XL · Найти тур
              </Button>
            </div>
            <div className="kit__row">
              <Badge>7 дней</Badge>
              <Badge variant="secondary">Всё включено</Badge>
              <Badge variant="outline">Группа 12</Badge>
              <Badge variant="cta">−15%</Badge>
              <Badge variant="gold">4.9 ★</Badge>
              <Badge variant="soft">Новинка</Badge>
            </div>
          </Section>

          <Section id="inputs" kicker="Forms" title="Инпуты" hint="Варианты полей и размеры.">
            <div className="kit__grid kit__grid_2">
              <Field>
                <FieldLabel>Default</FieldLabel>
                <Input placeholder="Куда едем?" />
              </Field>
              <Field>
                <FieldLabel>Filled</FieldLabel>
                <Input variant="filled" placeholder="Город вылета" />
              </Field>
              <Field>
                <FieldLabel>Soft</FieldLabel>
                <Input variant="soft" placeholder="Промокод" />
              </Field>
              <Field>
                <FieldLabel>Ghost</FieldLabel>
                <Input variant="ghost" placeholder="Поиск по каталогу" />
              </Field>
              <Field>
                <FieldLabel>Large</FieldLabel>
                <Input size="lg" placeholder="Имя в брони" />
              </Field>
              <Field>
                <FieldLabel>Ошибка</FieldLabel>
                <Input aria-invalid placeholder="Неверный email" />
              </Field>
            </div>
            <Textarea variant="filled" placeholder="Расскажите, какой отдых хотите…" />
          </Section>

          <Section id="cards" kicker="Surfaces" title="Карточки" hint="Поверхности каталога.">
            <div className="kit__grid kit__grid_2">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated</CardTitle>
                  <CardDescription>Мягкая тень для офферов.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Glass</CardTitle>
                  <CardDescription>Стекло для героя.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="outline">
                <CardHeader>
                  <CardTitle>Outline</CardTitle>
                  <CardDescription>Контур без заливки.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="muted">
                <CardHeader>
                  <CardTitle>Muted</CardTitle>
                  <CardDescription>Подложка фильтров.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="dark">
                <CardHeader>
                  <CardTitle>Dark</CardTitle>
                  <CardDescription>Ночные баннеры.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="interactive">
                <CardHeader>
                  <CardTitle>Interactive</CardTitle>
                  <CardDescription>Наведите — всплывёт.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </Section>

          <Section id="search" kicker="Hero" title="Поиск тура" hint="Направление, даты, гости.">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Куда отправимся?</CardTitle>
                <CardDescription>Маршрут за несколько секунд.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="kit__grid kit__grid_4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    toast.success("Нашли 18 туров на ваши даты");
                  }}
                >
                  <Field>
                    <FieldLabel>Направление</FieldLabel>
                    <Select defaultValue="greece">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greece">Греция</SelectItem>
                        <SelectItem value="italy">Италия</SelectItem>
                        <SelectItem value="japan">Япония</SelectItem>
                        <SelectItem value="iceland">Исландия</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Даты</FieldLabel>
                    <div className="input-wrap">
                      <CalendarDays className="input-wrap__icon" />
                      <Input className="input_icon" defaultValue="12–19 окт" />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Гости</FieldLabel>
                    <div className="input-wrap">
                      <Users className="input-wrap__icon" />
                      <Input className="input_icon" defaultValue="2 взрослых" />
                    </div>
                  </Field>
                  <Field className="field_end field_hidden-label">
                    <FieldLabel>Поиск</FieldLabel>
                    <Button type="submit" variant="cta" size="lg" className="button_full">
                      <Search />
                      Найти
                    </Button>
                  </Field>
                </form>
              </CardContent>
            </Card>
          </Section>

          <Section id="catalog" kicker="Catalog" title="Карточки туров" hint="Фото, рейтинг и бронь.">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="sea">Море</TabsTrigger>
                <TabsTrigger value="hike">Походы</TabsTrigger>
                <TabsTrigger value="city">Города</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="kit__grid kit__grid_3">
                  {tours.map((tour) => (
                    <Card key={tour.title} variant="interactive" className="card_flush">
                      <div className="card__media">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                        <Badge className="badge_overlay">{tour.tag}</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle>{tour.title}</CardTitle>
                        <CardDescription>
                          <span className="kit__place">
                            <MapPin />
                            {tour.place}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="card__row">
                        <Text variant={14} color="muted">
                          {tour.days} дней
                        </Text>
                        <span className="kit__rating">
                          <Star />
                          {tour.rating}
                        </span>
                      </CardContent>
                      <CardFooter className="card__row">
                        <Title variant={20}>{tour.price}</Title>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="cta" size="sm">
                              Бронь
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Бронирование</DialogTitle>
                              <DialogDescription>
                                {tour.title}. Оставьте контакты — подтвердим места.
                              </DialogDescription>
                            </DialogHeader>
                            <FieldGroup>
                              <Field>
                                <FieldLabel>Имя</FieldLabel>
                                <Input placeholder="Анна" />
                              </Field>
                              <Field>
                                <FieldLabel>Телефон</FieldLabel>
                                <Input placeholder="+7 999 000-00-00" />
                              </Field>
                            </FieldGroup>
                            <DialogFooter>
                              <Button
                                variant="cta"
                                onClick={() => toast.success("Заявка отправлена")}
                              >
                                Отправить заявку
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="sea">
                <Text variant={14}>Морские направления появятся в каталоге.</Text>
              </TabsContent>
              <TabsContent value="hike">
                <Text variant={14}>Пешие маршруты появятся в каталоге.</Text>
              </TabsContent>
              <TabsContent value="city">
                <Text variant={14}>Городские туры появятся в каталоге.</Text>
              </TabsContent>
            </Tabs>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#catalog" text="Назад" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#catalog" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#catalog">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#catalog" text="Дальше" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>

          <Section id="forms" kicker="Filters" title="Фильтры" hint="Бюджет, тип отдыха, удобства.">
            <div className="kit__grid kit__grid_2">
              <Card variant="muted">
                <CardHeader>
                  <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="kit__stack">
                  <Field>
                    <FieldLabel>Бюджет, тыс. ₽</FieldLabel>
                    <Slider defaultValue={[40, 180]} max={300} min={20} />
                  </Field>
                  <Field>
                    <FieldLabel>Тип отдыха</FieldLabel>
                    <RadioGroup defaultValue="any">
                      <Label>
                        <RadioGroupItem value="any" />
                        Любой
                      </Label>
                      <Label>
                        <RadioGroupItem value="beach" />
                        Пляж
                      </Label>
                      <Label>
                        <RadioGroupItem value="active" />
                        Активный
                      </Label>
                    </RadioGroup>
                  </Field>
                  <Label>
                    <Checkbox defaultChecked />
                    Завтраки включены
                  </Label>
                  <Label>
                    <Checkbox />
                    Прямой перелёт
                  </Label>
                  <Label className="label_between">
                    Только туры с гидом
                    <Switch defaultChecked />
                  </Label>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Заявка гиду</CardTitle>
                  <CardDescription>Индивидуальный маршрут.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input type="email" placeholder="you@email.com" />
                    </Field>
                    <Field>
                      <FieldLabel>Пожелания</FieldLabel>
                      <Textarea placeholder="Тихий залив и ужин на крыше..." />
                    </Field>
                    <Button onClick={() => toast.info("Сообщение сохранено как черновик")}>
                      <Plane />
                      Отправить
                    </Button>
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section id="feedback" kicker="Feedback" title="Состояния" hint="Алерты и тосты.">
            <div className="kit__stack">
              <Alert>
                <Info />
                <AlertTitle>Осталось 3 места</AlertTitle>
                <AlertDescription>
                  Группа на Санторини почти набрана — бронируйте сегодня.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <Info />
                <AlertTitle>Карта не прошла</AlertTitle>
                <AlertDescription>
                  Попробуйте другую карту или оформите заявку без оплаты.
                </AlertDescription>
              </Alert>
              <div className="kit__row">
                <Button
                  variant="outline"
                  onClick={() => toast.success("Тур добавлен в избранное")}
                >
                  Toast: избранное
                </Button>
                <Button variant="outline" onClick={() => toast.error("Даты заняты")}>
                  Toast: ошибка
                </Button>
              </div>
            </div>
          </Section>

          <Section id="overlays" kicker="Overlay" title="Меню и подсказки" hint="Аккаунт и состав тура.">
            <div className="kit__row">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Аккаунт</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Мария</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Мои брони</DropdownMenuItem>
                  <DropdownMenuItem>Избранное</DropdownMenuItem>
                  <DropdownMenuItem>Выйти</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary">Что входит</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>В стоимость тура</PopoverTitle>
                    <PopoverDescription>
                      Перелёт, отель 4*, завтраки и трансфер из аэропорта.
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Heart />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Добавить в избранное</TooltipContent>
              </Tooltip>
            </div>
          </Section>

          <Section id="content" kicker="Trust" title="Отзывы и FAQ" hint="Доверие до оплаты.">
            <div className="kit__grid kit__grid_2">
              <Card variant="elevated">
                <CardHeader>
                  <div className="card__person">
                    <Avatar size="lg">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" />
                      <AvatarFallback>АК</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Анна Котова</CardTitle>
                      <CardDescription>Тур «Санторини на закате»</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Text variant={16} color="default">
                    Гид встретил как старого друга. Закат с Ои — лучший вечер за год.
                  </Text>
                </CardContent>
              </Card>
              <Accordion type="single" collapsible>
                <AccordionItem value="visa">
                  <AccordionTrigger>Нужна ли виза?</AccordionTrigger>
                  <AccordionContent>
                    Для Шенгена помогаем собрать документы. Для Бали виза по прибытии.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pay">
                  <AccordionTrigger>Как оплатить тур?</AccordionTrigger>
                  <AccordionContent>
                    Картой онлайн, частями или по счёту для юрлица.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cancel">
                  <AccordionTrigger>Можно ли отменить?</AccordionTrigger>
                  <AccordionContent>
                    Бесплатная отмена за 21 день до вылета.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Section>
        </div>
      </Wrapper>
    </div>
  );
}
