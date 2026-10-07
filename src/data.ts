// Everything a visitor reads lives in this file.
// Search for "TODO" to find what still needs confirming or real content.

export type Discipline = "web" | "sec" | "data";
export type Filter = "all" | Discipline;

export const FILTERS: { id: Filter; verb: string; label: string }[] = [
  { id: "all", verb: "all", label: "Everything" },
  { id: "web", verb: "build", label: "Web" },
  { id: "sec", verb: "break", label: "Security" },
  { id: "data", verb: "measure", label: "Data" },
];

const user = "ramonadedotun550";
const domain = "gmail.com";

export const PROFILE = {
  name: "Ramon Adedotun",
  handle: "phantom",
  avatar: "/img/profile.jpg", // TODO: swap for a real photo when ready
  intro:
    "I ship full-stack web apps, test them like an attacker, and read the data afterward.",
  // Current roles, newest first.
  roles: [{ title: "CTO", org: "Alhazen", product: "Plugr", project: "plugr" }],
  location: "Nigeria",
  timezone: "Africa/Lagos",
  coords: { lat: 9.082, lon: 8.675 },
  // Assembled at runtime so the address isn't sitting in the HTML for scrapers.
  email: () => `${user}@${domain}`,
  available: true,
  links: {
    github: "https://github.com/Phantom-J-A-T",
    githubUser: "Phantom-J-A-T",
    x: "https://x.com/PhantomPha73894",
    linkedin: "https://www.linkedin.com/in/ramon-adedotun-b20479305",
    cv: null as string | null, // TODO: path to CV PDF, e.g. "/ramon-adedotun-cv.pdf"
  },
};

/** A real excerpt from the project's repository, shown instead of a picture. */
export interface CodeExcerpt {
  file: string;
  lang: "py" | "sql" | "ts" | "js";
  lines: string;
}

export interface Project {
  id: string;
  title: string;
  kicker: string;
  discipline: Discipline[];
  year: string;
  role: string;
  summary: string;
  body: string;
  notes: string[];
  stack: string[];
  image?: string;
  code?: CodeExcerpt;
  live: string | null;
  source: string | null;
  draft?: boolean; // placeholder project, shows a [draft] tag
  /** Portrait capture used by tall tiles; `image` stays the landscape hero. */
  imageTall?: string;
  /** Dither tuning: contrast, brightness, invert (for light UIs) and focal point. */
  tone?: { brightness?: number; contrast?: number; invert?: boolean; cell?: number; focus?: [number, number] };
}

const repo = (name: string) => `https://github.com/Phantom-J-A-T/${name}`;

export const PROJECTS: Project[] = [
  {
    id: "plugr",
    title: "Plugr",
    kicker: "Verified artisans, payments held in escrow",
    discipline: ["web", "sec"],
    year: "2026",
    role: "CTO, Alhazen",
    summary:
      "A verified identity platform for Nigerian artisans. Clients book NIN-verified electricians and plumbers over WhatsApp, and the payment waits in escrow until the job is confirmed done.",
    body:
      "Finding a reliable plumber or electrician in Lagos usually means a number from a neighbour and a quote that triples on the day. Plugr gives every artisan (a \"Plug\") a verified identity, a job history that follows them, and an escrow-protected payment flow. It launches in Yaba, built by Alhazen, where Ramon is CTO.",
    notes: [
      "Identity first: Plugs pass NIN-based verification before they can take a job.",
      "WhatsApp-first: clients and Plugs onboard and book without installing an app.",
      "Escrow: payment is held and released only when the client confirms the work.",
      "Category matching: find the right trade (electrician, plumber, tailor, mechanic) fast.",
    ],
    stack: ["NestJS", "Prisma", "PostgreSQL", "Next.js", "WhatsApp Cloud API", "BullMQ + Redis", "Render"],
    image: "/work/plugr.jpg",
    imageTall: "/work/plugr-mobile.jpg",
    tone: { invert: true, contrast: 1.5, cell: 2, focus: [0.5, 0.12] },
    live: "https://www.getplugr.com",
    source: "https://github.com/Plugr-HQ/Plugr_Web",
  },

  {
    id: "exam-cbt",
    title: "CBT Practice Portal",
    kicker: "Offline exam practice for Nigerian students",
    discipline: ["web"],
    year: "2026",
    role: "Solo",
    summary:
      "Timed, computer-based practice exams in Mathematics, English, Physics, Chemistry and Biology, built to keep working for students with poor connectivity.",
    body:
      "Students enter their name, school and state, then sit simulated papers in the same computer-based format as the national exams. Everything runs in the browser, so once the page has loaded an exam never waits on the network.",
    notes: [
      "Five subjects in a timed CBT format.",
      "Runs entirely client-side: no server round-trips mid-exam.",
      "Sign-in covers all 36 states and the FCT.",
    ],
    stack: ["TypeScript", "React", "Vercel"],
    image: "/work/exam-cbt.jpg",
    imageTall: "/work/exam-cbt-mobile.jpg",
    tone: { brightness: 0.12, contrast: 1.4, cell: 2, focus: [0.5, 0.2] },
    live: "https://exam-cbt-practice.vercel.app",
    source: repo("Exam_CBT_Practice"),
  },
  {
    id: "ip-shield",
    title: "IP tracking & threat detection",
    kicker: "Security middleware for Django",
    discipline: ["sec"],
    year: "2026",
    role: "Solo",
    summary:
      "Middleware that logs every request by IP and location, blocks known-bad addresses, and flags suspicious traffic every hour.",
    body:
      "Every request is attributed to a real client IP (honouring X-Forwarded-For), checked against a blocklist, geolocated and logged. Geolocation results are cached for 24 hours so lookups never slow the request path. An hourly Celery task scans the log for abuse patterns, and the login view is rate-limited separately for anonymous and signed-in users.",
    notes: [
      "Blocked IPs get a 403 before any view runs; a management command adds them.",
      "Flags IPs making 100+ requests an hour or probing /admin, /login and /wp-admin.",
      "Login rate limits: 5 a minute anonymous, 10 signed in, with a JSON 429.",
    ],
    stack: ["Django", "Celery", "Redis cache", "django-ratelimit", "ip-api"],
    code: {
      file: "ip_tracking/middleware.py",
      lang: "py",
      lines: `def __call__(self, request):
    # 1. Extract IP
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    ip = x_forwarded_for.split(',')[0] if x_forwarded_for \\
        else request.META.get('REMOTE_ADDR')

    # 2. Block check
    if BlockedIP.objects.filter(ip_address=ip).exists():
        return HttpResponseForbidden("Your IP has been blocked.")

    # 3. Geolocation, cached for 24 hours
    cache_key = f"geo_{ip}"
    geo_data = cache.get(cache_key)
    if not geo_data:
        response = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
        ...
        cache.set(cache_key, geo_data, 86400)

    # 4. Log the request
    RequestLog.objects.create(ip_address=ip, path=request.path, ...)
    return self.get_response(request)`,
    },
    live: null,
    source: repo("alx-backend-security"),
  },
  {
    id: "job-nexus",
    title: "Job Nexus",
    kicker: "Job board on a Django REST API",
    discipline: ["web"],
    year: "2026",
    role: "Solo",
    summary:
      "A job board where candidates filter open roles by category, experience level and location, backed by a Django REST API. The capstone of the ALX ProDev Backend programme.",
    body:
      "The front end lists roles with quick filters; the API behind it is a Django REST Framework service with JWT authentication, PostgreSQL, Redis caching and Celery for background work, containerised with Docker and shipped through a CI pipeline.",
    notes: [
      "Filter roles by category, experience level and location.",
      "N+1 queries removed with select_related and prefetch_related.",
      "Docker Compose for local development, CI before every deploy.",
    ],
    stack: ["Django REST Framework", "PostgreSQL", "Redis", "Celery", "Docker"],
    image: "/work/job-nexus.jpg",
    imageTall: "/work/job-nexus-mobile.jpg",
    tone: { invert: true, contrast: 1.9, brightness: 0.14, cell: 2, focus: [0.5, 0.05] },
    live: "https://alx-job-nexus.vercel.app",
    source: repo("alx-project-nexus"),
  },
  {
    id: "airbnb-db",
    title: "Booking database, tuned",
    kicker: "SQL design and query performance",
    discipline: ["data"],
    year: "2025",
    role: "Solo",
    summary:
      "An Airbnb-style schema normalised to 3NF, then tuned with indexes, query rewrites and yearly range partitions, each change measured with EXPLAIN ANALYZE.",
    body:
      "It starts with an ERD and a normalisation write-up for users, properties, bookings, payments and reviews, plus seed data. The reporting layer uses joins, subqueries, aggregations and window functions. Then the slow parts get fixed: indexes on the hot columns and a bookings table partitioned by start date, with before-and-after performance reports.",
    notes: [
      "ERD, 3NF normalisation and seed scripts.",
      "Joins, subqueries, aggregations and window functions for reporting.",
      "Indexes and RANGE partitioning, compared with EXPLAIN ANALYZE.",
    ],
    stack: ["PostgreSQL", "SQL", "EXPLAIN ANALYZE", "draw.io"],
    code: {
      file: "database-adv-script/partitioning.sql",
      lang: "sql",
      lines: `-- Range partitioning by year
CREATE TABLE bookings_partitioned (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (start_date);

CREATE TABLE bookings_2024 PARTITION OF bookings_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE bookings_2025 PARTITION OF bookings_partitioned
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Faster lookups inside each partition
CREATE INDEX idx_bookings_2025_user_id ON bookings_2025(user_id);`,
    },
    live: null,
    source: repo("alx-airbnb-database"),
  },
  {
    id: "skoolconnect",
    title: "SkoolConnectNG",
    kicker: "Social network for Nigerian campuses",
    discipline: ["web", "sec"],
    year: "2025", // TODO: confirm year
    role: "Full-stack", // TODO: confirm role
    summary:
      "A social network for university students and alumni. Sign-up is gated by institutional email, so every account maps to a real school.",
    body:
      "Students and alumni are matched by school and department. The backend is a Django REST Framework API with role-based verification; the client is a modular React app. Authentication uses short-lived JWTs, and every list endpoint is backed by indexed PostgreSQL queries.",
    notes: [
      "Registration only accepts verified institutional email domains.",
      "Role-based permissions separate students, alumni and admins at the API layer.",
      "Hot queries are indexed and cached to keep feeds fast.",
    ],
    stack: ["React", "Django REST Framework", "PostgreSQL", "JWT", "Tailwind CSS"],
    image: "/img/laptop-code.jpg", // TODO: real screenshot
    live: null, // TODO
    source: null, // TODO
  },
  {
    id: "graphql-crm",
    title: "GraphQL CRM",
    kicker: "Graphene, Celery and cron",
    discipline: ["web", "data"],
    year: "2026",
    role: "Solo",
    summary:
      "A CRM API in GraphQL: filterable customers, products and orders, with scheduled jobs that tidy the data and remind customers about orders.",
    body:
      "The schema exposes filterable connections for customers, products and orders, and mutations for creating them, including bulk customer import. Orders are validated and totalled on the server. Celery and crontab jobs restock low inventory, send order reminders and clean out inactive customers.",
    notes: [
      "Graphene-Django schema with filters and mutations, including bulk creation.",
      "Order creation validates every product and computes the total server-side.",
      "Scheduled jobs for low-stock updates, reminders and cleanup.",
    ],
    stack: ["Django", "Graphene", "django-filter", "Celery", "cron"],
    code: {
      file: "crm/schema.py",
      lang: "py",
      lines: `class CreateOrder(graphene.Mutation):
    order = graphene.Field(OrderType)

    class Arguments:
        customer_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID, required=True)

    def mutate(self, info, customer_id, product_ids):
        if not product_ids:
            raise ValidationError("At least one product is required")

        customer = Customer.objects.get(id=customer_id)
        products = Product.objects.filter(id__in=product_ids)
        if products.count() != len(product_ids):
            raise ValidationError("Invalid product ID")

        total = sum(product.price for product in products)
        order = Order.objects.create(customer=customer, total_amount=total)
        order.products.set(products)
        return CreateOrder(order=order)`,
    },
    live: null,
    source: repo("alx-backend-graphql_crm"),
  },
  {
    id: "coffee-app",
    title: "Coffee ordering app",
    kicker: "React Native with Expo",
    discipline: ["web"],
    year: "2026",
    role: "Solo",
    summary:
      "A mobile coffee ordering app: product grid, product pages, cart and delivery, with shared-element transitions between screens.",
    body:
      "Built with Expo Router and previewed on device with Expo Go. Styling is NativeWind; motion is Reanimated, including shared transitions that carry a product image from the grid into its detail page. Getting NativeWind working with TypeScript took its own debugging session.",
    notes: [
      "Expo Router: tabs, product/[id], cart and delivery routes.",
      "Shared-element image transitions with Reanimated.",
      "NativeWind (Tailwind for React Native) for styling.",
    ],
    stack: ["React Native", "Expo", "TypeScript", "NativeWind", "Reanimated"],
    code: {
      file: "components/ui/CoffeeCard.tsx",
      lang: "ts",
      lines: `export const CoffeeCard = ({ id, image, title, price, rating, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white p-3 rounded-[24px] w-[47%] mb-4"
    >
      <View className="relative">
        <Animated.Image
          sharedTransitionTag={\`image-\${id}\`}
          source={image}
          className="w-full h-32 rounded-2xl"
        />
        <Animated.View entering={FadeIn.delay(300)}>
          <Star size={10} color="#FBBE21" fill="#FBBE21" />
          <Text>{rating}</Text>
        </Animated.View>
      </View>
      ...`,
    },
    live: null,
    source: repo("alx-coffee-shop-app"),
  },
  {
    id: "travel-payments",
    title: "Travel bookings with Chapa",
    kicker: "Payments and background email",
    discipline: ["web"],
    year: "2026",
    role: "Solo",
    summary:
      "A booking API for travel listings that takes payment through Chapa, verifies it server-side, and emails a confirmation in the background.",
    body:
      "Listings, bookings, reviews and payments are Django models exposed through DRF. A booking starts a Chapa transaction and returns the checkout URL; verification happens on the server against Chapa's API, the payment record moves to completed or failed, and Celery sends the confirmation email outside the request.",
    notes: [
      "Payment states tracked as pending, completed or failed.",
      "Secrets live in environment variables, never in code.",
      "A seed command fills the database with sample listings.",
    ],
    stack: ["Django REST Framework", "Chapa API", "Celery", "Render"],
    code: {
      file: "listings/views.py",
      lang: "py",
      lines: `headers = {'Authorization': f'Bearer {settings.CHAPA_SECRET_KEY}'}

response = requests.get(
    f'https://api.chapa.co/v1/transaction/verify/{tx_ref}',
    headers=headers
)
data = response.json()

if data.get('status') == 'success':
    payment.status = 'COMPLETED'
    payment.save()

    # Confirmation email happens off the request path
    send_payment_confirmation.delay(payment.email)
    return Response({'message': 'Payment verified successfully'})

payment.status = 'FAILED'
payment.save()`,
    },
    live: null,
    source: repo("alx_travel_app_0x03"),
  },
  {
    id: "property-cache",
    title: "Redis-cached listings",
    kicker: "Caching you can measure",
    discipline: ["web", "data"],
    year: "2026",
    role: "Solo",
    summary:
      "Property listings served from Redis: cached views, a one-hour queryset cache, signal-based invalidation, and a hit-ratio report.",
    body:
      "Redis and PostgreSQL run side by side in Docker Compose. Listing views are cached, the full queryset is cached for an hour, and Django signals clear it whenever a property is saved or deleted. A metrics helper reads Redis keyspace hits and misses and logs the hit ratio, so the cache is judged by numbers rather than hope.",
    notes: [
      "View-level and low-level queryset caching.",
      "Signals invalidate the cache on every write.",
      "Hit ratio computed from Redis keyspace stats.",
    ],
    stack: ["Django", "Redis", "django-redis", "PostgreSQL", "Docker Compose"],
    code: {
      file: "properties/utils.py",
      lang: "py",
      lines: `def get_all_properties():
    queryset = cache.get('all_properties')
    if queryset is None:
        queryset = Property.objects.all()
        cache.set('all_properties', queryset, 3600)
    return queryset

def get_redis_cache_metrics():
    con = get_redis_connection("default")
    info = con.info()
    hits = info.get('keyspace_hits', 0)
    misses = info.get('keyspace_misses', 0)

    total_requests = hits + misses
    hit_ratio = hits / total_requests if total_requests > 0 else 0

    logger.info(f"Redis Metrics - Hits: {hits}, "
                f"Misses: {misses}, Ratio: {hit_ratio:.2f}")`,
    },
    live: null,
    source: repo("alx-backend-caching_property_listings"),
  },
  {
    id: "princess-store",
    title: "Prince & Princess Store",
    kicker: "E-commerce built to rank",
    discipline: ["web"],
    year: "2025",
    role: "Full-stack",
    summary:
      "A storefront built for organic search: server-rendered pages, schema.org product data, and a fast client-side cart.",
    body:
      "Product pages render on the server and ship structured JSON-LD so search engines can show price and stock in results. Behind it is a Django REST backend split into users, products and cart apps.",
    notes: [
      "Server-rendered product and category pages.",
      "schema.org Product markup for rich search results.",
      "Django REST backend with users, products and cart apps.",
    ],
    stack: ["Next.js", "Django REST Framework", "Tailwind CSS", "JSON-LD"],
    image: "/img/night-street.jpg", // TODO: real screenshot
    live: null, // TODO
    source: repo("PrinceandPrincess"),
  },
  {
    id: "typing-test",
    title: "Typing Speed Tester",
    kicker: "Desktop app, Python + Tkinter",
    discipline: ["data"],
    year: "2025",
    role: "Solo",
    summary:
      "A desktop typing test with three difficulty levels, live words-per-minute and colour-coded feedback, shipped as a single .exe.",
    body:
      "Tests run for five minutes on Easy, Medium or Hard sentences drawn from a sample file covering physics, biology, maths and more. WPM updates as you type, every character is marked correct, wrong or extra, and a results window starts the next round when you close it.",
    notes: [
      "Five-minute timed tests with three difficulty levels.",
      "Live WPM and per-character feedback.",
      "Light and dark themes; packaged as a standalone executable.",
    ],
    stack: ["Python", "Tkinter"],
    image: "/img/code-screen.jpg", // TODO: real screenshot
    tone: { brightness: 0.1, contrast: 1.4 },
    live: null,
    source: repo("Type_speed_tester"),
  },
];

export const TODOS = [
  // TODO: replace with real goals
  { text: "Dual-boot Kali + Windows lab", done: true },
  { text: "Finish ALX ProDev Backend", done: true },
  { text: "Publish a first CTF write-up", done: false },
  { text: "Earn eJPT, then OSCP", done: false },
  { text: "Open-source a Django auth kit", done: false },
];

export const TOOLCHAIN: { name: string; d: Discipline }[] = [
  { name: "React", d: "web" },
  { name: "Next.js", d: "web" },
  { name: "TypeScript", d: "web" },
  { name: "Django", d: "web" },
  { name: "DRF", d: "web" },
  { name: "GraphQL", d: "web" },
  { name: "Expo", d: "web" },
  { name: "Docker", d: "web" },
  { name: "Celery", d: "web" },
  { name: "Kali", d: "sec" },
  { name: "Nmap", d: "sec" },
  { name: "Burp Suite", d: "sec" },
  { name: "Rate limiting", d: "sec" },
  { name: "PostgreSQL", d: "data" },
  { name: "Redis", d: "data" },
  { name: "Python", d: "data" },
  { name: "Pandas", d: "data" },
  { name: "Power BI", d: "data" },
];

// Real numbers: primary language of each original (non-fork) public repo, October 2026.
export const LANGUAGE_SERIES = {
  title: "Repos by language",
  caption: "41 public repos",
  points: [
    { label: "Python", value: 13 },
    { label: "TS", value: 9 },
    { label: "JS", value: 6 },
    { label: "HTML", value: 3 },
    { label: "Shell", value: 1 },
    { label: "Docs", value: 9 },
  ],
};

export const SECRET_NOTE = "if you can read this, you should probably email me.";
