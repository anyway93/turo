"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
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
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Text, Title } from "@/components/ui/typography";

const palette = [
  { name: "Sand", token: "background", className: "bg-background" },
  { name: "Ink", token: "foreground", className: "bg-foreground" },
  { name: "Ocean", token: "primary", className: "bg-primary" },
  { name: "Sunset", token: "cta", className: "bg-cta" },
  { name: "Gold", token: "gold", className: "bg-gold" },
  { name: "Muted", token: "muted", className: "bg-muted" },
];

const typeSizes = [60, 48, 32, 20, 16, 14, 12] as const;
const typeColors = [
  "default",
  "muted",
  "primary",
  "cta",
  "gold",
  "destructive",
] as const;

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
    <section id={id} className="scroll-mt-28 space-y-8">
      <div className="max-w-2xl space-y-2">
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
    <div className="min-h-full overflow-x-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 right-[-10%] h-[520px] w-[520px] rounded-full bg-cta/10 blur-3xl" />
        <div className="absolute top-40 left-[-8%] h-[420px] w-[420px] rounded-full bg-primary/12 blur-3xl" />
      </div>

      <header className="sticky top-4 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-6xl">
        <div className="flex h-16 items-center justify-between rounded-full border border-white/50 bg-card/70 px-3 shadow-[0_12px_40px_-24px_oklch(0.24_0.03_185/_0.45)] backdrop-blur-xl sm:px-5">
          <Link href="/" className="flex items-center gap-2 pl-1">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Compass className="size-4" />
            </span>
            <span className="font-display text-xl font-semibold">Turo</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#catalog" className="hover:text-foreground">
              Туры
            </a>
            <a href="#search" className="hover:text-foreground">
              Направления
            </a>
            <a href="#content" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-1.5">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                  <SheetDescription>Разделы витрины</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-3 px-4">
                  {sections.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="text-sm">
                      {item.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" className="hidden sm:inline-flex">
              Войти
            </Button>
            <Button variant="cta">Найти тур</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-[180px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-1">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-24 pb-24">
          <div className="space-y-6 pt-4">
            <Badge variant="soft">UI kit · Turo</Badge>
            <Title variant={60} className="max-w-3xl">
              Интерфейс, в который хочется уехать
            </Title>
            <Text variant={20} color="muted" className="max-w-2xl">
              Плавные кнопки, мягкие карточки и типографика с размерами 60 → 12.
              Собирайте каталог туров без подчёркиваний и шума.
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
            hint="variant={60 | 48 | 32 | 20 | 16 | 14 | 12}, color='primary' | 'muted' | 'cta' | 'gold'…"
          >
            <Card variant="elevated">
              <CardContent className="space-y-5 pt-1">
                {typeSizes.map((size) => (
                  <div key={size} className="space-y-1">
                    <Text variant={12} color="muted">
                      Title · {size}
                    </Text>
                    <Title variant={size}>Уехать. Увидеть. Запомнить.</Title>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2">
              {typeColors.map((color) => (
                <Card key={color} variant="muted" size="sm">
                  <CardContent className="space-y-1 pt-1">
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

          <Section
            id="palette"
            kicker="Color"
            title="Палитра"
            hint="Песок, океан и терракота заката — один тон на весь продукт."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {palette.map((swatch) => (
                <div
                  key={swatch.token}
                  className="overflow-hidden rounded-3xl ring-1 ring-foreground/8 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className={`h-20 ${swatch.className}`} />
                  <div className="bg-card px-3 py-2.5">
                    <Title variant={14}>{swatch.name}</Title>
                    <Text variant={12} color="muted">
                      --{swatch.token}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="buttons"
            kicker="Actions"
            title="Кнопки"
            hint="default, cta, gold, soft, glass, inverse, outline, ghost, text — и размеры xs → xl."
          >
            <div className="flex flex-wrap gap-2">
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
                <ArrowUpRight data-icon="inline-end" />
              </Button>
              <Button variant="destructive">Отменить</Button>
              <Button size="icon" variant="outline">
                <Heart />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="default">MD</Button>
              <Button size="lg">LG</Button>
              <Button size="xl" variant="cta">
                XL · Найти тур
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>7 дней</Badge>
              <Badge variant="secondary">Всё включено</Badge>
              <Badge variant="outline">Группа 12</Badge>
              <Badge variant="cta">−15%</Badge>
              <Badge variant="gold">4.9 ★</Badge>
              <Badge variant="soft">Новинка</Badge>
            </div>
          </Section>

          <Section
            id="inputs"
            kicker="Forms"
            title="Инпуты"
            hint="default, filled, soft, ghost, glass и размеры sm / default / lg / xl."
          >
            <div className="grid gap-4 md:grid-cols-2">
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

          <Section
            id="cards"
            kicker="Surfaces"
            title="Карточки"
            hint="default, elevated, glass, outline, muted, dark, interactive."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated</CardTitle>
                  <CardDescription>Мягкая тень для офферов.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Glass</CardTitle>
                  <CardDescription>Стекло для героя и оверлеев.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="outline">
                <CardHeader>
                  <CardTitle>Outline</CardTitle>
                  <CardDescription>Лёгкий контур без заливки.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="muted">
                <CardHeader>
                  <CardTitle>Muted</CardTitle>
                  <CardDescription>Тихая подложка для фильтров.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="dark">
                <CardHeader>
                  <CardTitle>Dark</CardTitle>
                  <CardDescription>Для баннеров и ночных городов.</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="interactive">
                <CardHeader>
                  <CardTitle>Interactive</CardTitle>
                  <CardDescription>Наведите — карточка всплывёт.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </Section>

          <Section
            id="search"
            kicker="Hero"
            title="Поиск тура"
            hint="Главный блок: направление, даты, гости — одной стеклянной панелью."
          >
            <Card variant="glass" className="shadow-[0_30px_80px_-40px_oklch(0.24_0.03_185/_0.45)]">
              <CardHeader>
                <CardTitle>Куда отправимся?</CardTitle>
                <CardDescription>Маршрут за несколько секунд.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="grid gap-3 md:grid-cols-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    toast.success("Нашли 18 туров на ваши даты");
                  }}
                >
                  <Field>
                    <FieldLabel>Направление</FieldLabel>
                    <Select defaultValue="greece">
                      <SelectTrigger className="w-full">
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
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" defaultValue="12–19 окт" />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Гости</FieldLabel>
                    <div className="relative">
                      <Users className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" defaultValue="2 взрослых" />
                    </div>
                  </Field>
                  <Field className="justify-end">
                    <FieldLabel className="opacity-0">Поиск</FieldLabel>
                    <Button type="submit" variant="cta" size="lg" className="w-full">
                      <Search data-icon="inline-start" />
                      Найти
                    </Button>
                  </Field>
                </form>
              </CardContent>
            </Card>
          </Section>

          <Section
            id="catalog"
            kicker="Catalog"
            title="Карточки туров"
            hint="Фото с плавным зумом, рейтинг, цена и бронь."
          >
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="sea">Море</TabsTrigger>
                <TabsTrigger value="hike">Походы</TabsTrigger>
                <TabsTrigger value="city">Города</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="grid gap-5 md:grid-cols-3">
                  {tours.map((tour) => (
                    <Card key={tour.title} variant="interactive" className="py-0">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-md">
                          {tour.tag}
                        </Badge>
                      </div>
                      <CardHeader className="pt-5">
                        <CardTitle>{tour.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {tour.place}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <Text variant={14} color="muted">
                          {tour.days} дней
                        </Text>
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Star className="size-3.5 fill-gold text-gold" />
                          {tour.rating}
                        </span>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <Title variant={20}>{tour.price}</Title>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="cta" size="sm">
                              Бронь
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
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
              <TabsContent value="sea" className="mt-6">
                <Text variant={14}>Морские направления появятся в каталоге.</Text>
              </TabsContent>
              <TabsContent value="hike" className="mt-6">
                <Text variant={14}>Пешие маршруты появятся в каталоге.</Text>
              </TabsContent>
              <TabsContent value="city" className="mt-6">
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

          <Section
            id="forms"
            kicker="Filters"
            title="Фильтры"
            hint="Бюджет, тип отдыха и удобства для сайдбара каталога."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Card variant="muted">
                <CardHeader>
                  <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Field>
                    <FieldLabel>Бюджет, тыс. ₽</FieldLabel>
                    <Slider defaultValue={[40, 180]} max={300} min={20} />
                  </Field>
                  <Field>
                    <FieldLabel>Тип отдыха</FieldLabel>
                    <RadioGroup defaultValue="any">
                      <Label className="flex items-center gap-2">
                        <RadioGroupItem value="any" />
                        Любой
                      </Label>
                      <Label className="flex items-center gap-2">
                        <RadioGroupItem value="beach" />
                        Пляж
                      </Label>
                      <Label className="flex items-center gap-2">
                        <RadioGroupItem value="active" />
                        Активный
                      </Label>
                    </RadioGroup>
                  </Field>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Checkbox defaultChecked />
                      Завтраки включены
                    </Label>
                    <Label className="flex items-center gap-2">
                      <Checkbox />
                      Прямой перелёт
                    </Label>
                    <Label className="flex items-center justify-between gap-2">
                      Только туры с гидом
                      <Switch defaultChecked />
                    </Label>
                  </div>
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
                    <Button
                      onClick={() =>
                        toast.info("Сообщение сохранено как черновик")
                      }
                    >
                      <Plane data-icon="inline-start" />
                      Отправить
                    </Button>
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section
            id="feedback"
            kicker="Feedback"
            title="Состояния"
            hint="Остаток мест, ошибка оплаты, тосты."
          >
            <div className="space-y-3">
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
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => toast.success("Тур добавлен в избранное")}
                >
                  Toast: избранное
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.error("Даты заняты")}
                >
                  Toast: ошибка
                </Button>
              </div>
            </div>
          </Section>

          <Section
            id="overlays"
            kicker="Overlay"
            title="Меню и подсказки"
            hint="Аккаунт, состав тура, избранное."
          >
            <div className="flex flex-wrap gap-2">
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

          <Section
            id="content"
            kicker="Trust"
            title="Отзывы и FAQ"
            hint="Социальное доказательство до оплаты."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center gap-3">
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
                    Гид встретил как старого друга. Закат с Ои — лучший вечер за
                    год. Организация без суеты.
                  </Text>
                </CardContent>
              </Card>
              <Accordion type="single" collapsible>
                <AccordionItem value="visa">
                  <AccordionTrigger>Нужна ли виза?</AccordionTrigger>
                  <AccordionContent>
                    Для Шенгена помогаем собрать документы. Для Бали виза по
                    прибытии.
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
                    Бесплатная отмена за 21 день до вылета, дальше — по тарифу
                    авиакомпании.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
