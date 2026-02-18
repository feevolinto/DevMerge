--
-- PostgreSQL database dump
--

\restrict i4H3z8tPsZGA1ofPEJgkCS98TxLmtGdMP4vIjg03hsdeI7ERpSsMZlGhKtK4dcD

-- Dumped from database version 16.11 (df20cf9)
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationType" AS ENUM (
    'JOIN',
    'GROUP_DELETED',
    'GROUP_UPDATED',
    'NEW_MEMBER'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'LEADER',
    'MEMBER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: Group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Group" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    timeline text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "creatorId" text NOT NULL
);


--
-- Name: GroupMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GroupMember" (
    id text NOT NULL,
    role public."Role" DEFAULT 'MEMBER'::public."Role" NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "groupId" text NOT NULL,
    "userId" text NOT NULL
);


--
-- Name: GroupTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GroupTag" (
    "groupId" text NOT NULL,
    "tagId" text NOT NULL
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    type public."NotificationType" NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "groupId" text,
    "actorId" text,
    "userId" text NOT NULL
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text,
    bio text,
    "profileImage" text,
    "emailVerified" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Group" (id, title, description, timeline, "isActive", "createdAt", "updatedAt", "creatorId") FROM stdin;
044a3540-7d8f-4881-9441-f90bccf19e42	Provision	ProVision is an AI-Powered Software-as-a-Service (SaaS) for Smart Inventory, Sales Forecasting, and Supply Network Mapping with a Business-to-Business (B2B) Raw Material Marketplace for MSMEs	1 month	t	2026-02-17 17:40:02.285	2026-02-17 17:40:02.285	3b137f8f-9957-43fc-b5c3-1a27d55ce2d7
62285844-6b45-4b10-8a97-7b36efe91a35	AwAir	Awair is an IoT device that delivers real-time monitoring and detection of methane and carbon dioxide, paired with a web app for accessible insights. Designed to support the challenge of uncovering the role of greenhouse gases in your neighborhood, it provides high-quality GHG information to help communities better understand both anthropogenic and natural emissions.	6 months	t	2026-02-10 15:55:55.926	2026-02-17 17:41:58.539	0b65df5a-75c6-4625-91d9-76a69c25ad39
4b0006d5-9b24-463f-872e-438cbe466d84	Quack: Task Management Board	Quack, a full-stack task and project management platform built using the MERN stack(MongoDB, Express.js, React.js, and Node.js), with the UI/UX designed in Figma.\n\nQuack centralizes project tracking, task progression, and workflow management into a single dashboard—helping users stay organized, focused, and productive from to-do to finished.	1 month	t	2026-02-10 15:55:55.399	2026-02-17 19:46:00.903	32e12459-be79-433f-bd46-fb5ba0cba39a
7c3df622-440b-4164-801e-53425e49e374	Campus Repo	A blog publication by UP Mindanao BS Computer Science, featuring the latest updates on our community, tech event participation, and student-driven projects—documenting our journey as we learn, build, and contribute to the tech ecosystem.	1 month	t	2026-02-10 15:55:53.629	2026-02-17 19:49:22.447	75d677aa-61d3-4733-a6dd-ab61854ebd43
5b339c0f-9b5f-4445-b395-29ad9db1daf3	From Zero to Full-Stack: Getting Started with Your First MERN Architecture Project	1. Introduction to Building a Full-Stack MERN webapp\n2. Architecture for MERN-Based Full-Stack Systems	1 month	t	2026-02-10 15:55:54.701	2026-02-17 19:53:43.015	78ba3833-1a8f-42ea-8125-cb71fbbc792e
89e4fdc0-39a0-4035-b2cb-cb3422c48bbd	Coming Soon	Cloud based project	1 month	t	2026-02-18 07:19:17.699	2026-02-18 07:19:17.699	3b137f8f-9957-43fc-b5c3-1a27d55ce2d7
\.


--
-- Data for Name: GroupMember; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GroupMember" (id, role, "joinedAt", "groupId", "userId") FROM stdin;
f6dd50cd-a7b4-49b8-b89c-36aa848507ac	LEADER	2026-02-10 15:55:53.629	7c3df622-440b-4164-801e-53425e49e374	75d677aa-61d3-4733-a6dd-ab61854ebd43
fc39a965-c580-4758-ab13-311d78025333	LEADER	2026-02-10 15:55:54.701	5b339c0f-9b5f-4445-b395-29ad9db1daf3	78ba3833-1a8f-42ea-8125-cb71fbbc792e
0d77ee88-4a75-4aea-aac6-ee6d5b4c0977	LEADER	2026-02-10 15:55:55.399	4b0006d5-9b24-463f-872e-438cbe466d84	32e12459-be79-433f-bd46-fb5ba0cba39a
ca1a5680-63a4-4f2a-b242-9bab4f45dafd	LEADER	2026-02-10 15:55:55.926	62285844-6b45-4b10-8a97-7b36efe91a35	0b65df5a-75c6-4625-91d9-76a69c25ad39
106c0855-9f10-4ba1-b4ff-6884b4c33229	MEMBER	2026-02-10 15:55:56.499	7c3df622-440b-4164-801e-53425e49e374	78ba3833-1a8f-42ea-8125-cb71fbbc792e
37a07e47-090b-4f27-942d-c5df855c01a9	MEMBER	2026-02-10 15:55:56.67	7c3df622-440b-4164-801e-53425e49e374	32e12459-be79-433f-bd46-fb5ba0cba39a
258e54bb-0743-4ddc-911f-f8410dab0615	MEMBER	2026-02-10 15:55:56.757	5b339c0f-9b5f-4445-b395-29ad9db1daf3	75d677aa-61d3-4733-a6dd-ab61854ebd43
426d9dbc-040a-409c-8a09-b87acf564858	MEMBER	2026-02-13 11:18:23.791	4b0006d5-9b24-463f-872e-438cbe466d84	temp-user-001
604bd35f-8ff7-4a3c-95c1-b543d21c2c7d	MEMBER	2026-02-13 11:18:31.955	5b339c0f-9b5f-4445-b395-29ad9db1daf3	temp-user-001
94c131f7-143d-4164-a5cf-4ef8ed2eb69a	MEMBER	2026-02-13 11:42:08.413	7c3df622-440b-4164-801e-53425e49e374	temp-user-001
8828407d-9741-468a-9002-aa082d14ca88	MEMBER	2026-02-14 13:59:45.042	4b0006d5-9b24-463f-872e-438cbe466d84	75d677aa-61d3-4733-a6dd-ab61854ebd43
89dcffff-bf98-4749-b4d4-91740c04cce7	MEMBER	2026-02-15 07:41:52.252	7c3df622-440b-4164-801e-53425e49e374	556f0c24-bf24-4176-816b-783575c7a647
acce2aa8-907f-4f83-87db-cc5f47ce6611	MEMBER	2026-02-17 17:20:23.577	7c3df622-440b-4164-801e-53425e49e374	3af0e19c-2ff9-41a9-95c9-2f3bee8cbbd9
508d8d93-a11b-44af-94ea-003838c46bc3	LEADER	2026-02-17 17:40:02.285	044a3540-7d8f-4881-9441-f90bccf19e42	3b137f8f-9957-43fc-b5c3-1a27d55ce2d7
99b7765f-328b-4cd8-843b-774f80ecb428	MEMBER	2026-02-17 17:42:30.635	62285844-6b45-4b10-8a97-7b36efe91a35	3b137f8f-9957-43fc-b5c3-1a27d55ce2d7
98d81525-1aae-4b8b-87e6-84bb0f76daf5	LEADER	2026-02-18 07:19:17.699	89e4fdc0-39a0-4035-b2cb-cb3422c48bbd	3b137f8f-9957-43fc-b5c3-1a27d55ce2d7
\.


--
-- Data for Name: GroupTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GroupTag" ("groupId", "tagId") FROM stdin;
044a3540-7d8f-4881-9441-f90bccf19e42	91e0d092-2610-4d41-9f60-1dc8859e9cd2
044a3540-7d8f-4881-9441-f90bccf19e42	0329abd7-87da-423f-bd12-6c5a89e36c4a
62285844-6b45-4b10-8a97-7b36efe91a35	d6c3adc3-94ab-492a-b378-a6a06aece45e
62285844-6b45-4b10-8a97-7b36efe91a35	09d58909-88e3-479c-8ca5-295eadba8b61
62285844-6b45-4b10-8a97-7b36efe91a35	cea82fbb-7897-470c-982b-5d7194d94aa1
62285844-6b45-4b10-8a97-7b36efe91a35	004dd924-cc5f-4a76-9b55-78e3adf6064b
62285844-6b45-4b10-8a97-7b36efe91a35	fcb21b8e-f57e-4549-9fc7-c89bfb28d390
62285844-6b45-4b10-8a97-7b36efe91a35	4390ed9d-a621-4646-aae6-ed0f79518726
4b0006d5-9b24-463f-872e-438cbe466d84	0c106268-738b-49d6-a21c-e48acf73ac6d
4b0006d5-9b24-463f-872e-438cbe466d84	6916a409-5c3c-49ca-9d86-9ec6a4959daa
4b0006d5-9b24-463f-872e-438cbe466d84	6bb12b31-202f-4ca0-987e-642d847b889a
4b0006d5-9b24-463f-872e-438cbe466d84	0329abd7-87da-423f-bd12-6c5a89e36c4a
4b0006d5-9b24-463f-872e-438cbe466d84	91e0d092-2610-4d41-9f60-1dc8859e9cd2
7c3df622-440b-4164-801e-53425e49e374	3da47227-6117-43b9-8ade-00719912b7ed
7c3df622-440b-4164-801e-53425e49e374	6e06251f-9979-4af2-ba68-f14b95ba2f7b
7c3df622-440b-4164-801e-53425e49e374	0329abd7-87da-423f-bd12-6c5a89e36c4a
7c3df622-440b-4164-801e-53425e49e374	91e0d092-2610-4d41-9f60-1dc8859e9cd2
7c3df622-440b-4164-801e-53425e49e374	67d75664-f463-4059-b74e-4900e8419486
5b339c0f-9b5f-4445-b395-29ad9db1daf3	3da47227-6117-43b9-8ade-00719912b7ed
5b339c0f-9b5f-4445-b395-29ad9db1daf3	b9b9af93-ca3f-42e4-b870-00d59cb5835f
89e4fdc0-39a0-4035-b2cb-cb3422c48bbd	f1c54510-742b-43af-bec5-2aaac9fa335b
89e4fdc0-39a0-4035-b2cb-cb3422c48bbd	9487e1b3-c64b-4ad1-a012-3f9f898e99ec
89e4fdc0-39a0-4035-b2cb-cb3422c48bbd	6e06251f-9979-4af2-ba68-f14b95ba2f7b
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (id, type, message, "isRead", "createdAt", "groupId", "actorId", "userId") FROM stdin;
a1ace34c-fbb6-491f-93cd-af6094560d56	JOIN	Bob Smith joined your group "AI Chatbot for Customer Service"	f	2026-02-10 15:55:56.838	7c3df622-440b-4164-801e-53425e49e374	78ba3833-1a8f-42ea-8125-cb71fbbc792e	75d677aa-61d3-4733-a6dd-ab61854ebd43
02e39bac-4bd0-4ac5-8867-2fc9ba687a03	JOIN	Carol Williams joined your group "AI Chatbot for Customer Service"	f	2026-02-10 15:55:56.838	7c3df622-440b-4164-801e-53425e49e374	32e12459-be79-433f-bd46-fb5ba0cba39a	75d677aa-61d3-4733-a6dd-ab61854ebd43
2bde6378-722e-43d0-9fe6-69eadaa2b34a	JOIN	Alice Johnson joined your group "Serverless E-commerce Platform"	f	2026-02-10 15:55:56.838	5b339c0f-9b5f-4445-b395-29ad9db1daf3	75d677aa-61d3-4733-a6dd-ab61854ebd43	78ba3833-1a8f-42ea-8125-cb71fbbc792e
2eeb9c06-fd99-4e6b-8d71-b1f0fb881283	JOIN	Someone joined your group "Blockchain-Based Voting System"	f	2026-02-12 07:07:40.515	62285844-6b45-4b10-8a97-7b36efe91a35	temp-user-001	0b65df5a-75c6-4625-91d9-76a69c25ad39
29bb59fc-6003-44b9-ab39-626ccbefe080	JOIN	Someone joined your group "Blockchain-Based Voting System"	f	2026-02-13 11:18:10.775	62285844-6b45-4b10-8a97-7b36efe91a35	temp-user-001	0b65df5a-75c6-4625-91d9-76a69c25ad39
e97fe21a-f1a2-4573-aa39-8a4ce098fd8b	JOIN	Someone joined your group "Cross-Platform Fitness Tracker"	f	2026-02-13 11:18:24.229	4b0006d5-9b24-463f-872e-438cbe466d84	temp-user-001	32e12459-be79-433f-bd46-fb5ba0cba39a
779f5904-f75b-481f-a401-92e89320e4c7	JOIN	Someone joined your group "Serverless E-commerce Platform"	f	2026-02-13 11:18:33.453	5b339c0f-9b5f-4445-b395-29ad9db1daf3	temp-user-001	78ba3833-1a8f-42ea-8125-cb71fbbc792e
b8ddf312-9a59-4b77-b2fe-f441954694db	JOIN	Someone joined your group "AI Chatbot for Customer Service"	f	2026-02-13 11:42:09.071	7c3df622-440b-4164-801e-53425e49e374	temp-user-001	75d677aa-61d3-4733-a6dd-ab61854ebd43
a0752f0e-bdd4-46f8-9692-944fee022246	JOIN	Alice Johnson joined your group "Cross-Platform Fitness Tracker"	f	2026-02-14 13:59:45.589	4b0006d5-9b24-463f-872e-438cbe466d84	75d677aa-61d3-4733-a6dd-ab61854ebd43	32e12459-be79-433f-bd46-fb5ba0cba39a
7de3a603-8c27-4b47-8192-6c84144caab0	JOIN	Test User joined your group "AI Chatbot for Customer Service"	f	2026-02-15 07:41:52.847	7c3df622-440b-4164-801e-53425e49e374	556f0c24-bf24-4176-816b-783575c7a647	75d677aa-61d3-4733-a6dd-ab61854ebd43
43ab28eb-eb8d-4bee-9211-7bc325282e73	JOIN	junjun loveyu joined your group "AI Chatbot for Customer Service"	f	2026-02-17 17:20:24.546	7c3df622-440b-4164-801e-53425e49e374	3af0e19c-2ff9-41a9-95c9-2f3bee8cbbd9	75d677aa-61d3-4733-a6dd-ab61854ebd43
9237ce29-62d1-4308-83b8-19d10f308322	JOIN	Feevol Into joined your group "AwAir"	f	2026-02-17 17:42:31.469	62285844-6b45-4b10-8a97-7b36efe91a35	3b137f8f-9957-43fc-b5c3-1a27d55ce2d7	0b65df5a-75c6-4625-91d9-76a69c25ad39
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (id, name, slug, "createdAt") FROM stdin;
3da47227-6117-43b9-8ade-00719912b7ed	Full Stack	full-stack	2026-02-10 15:55:51.917
b9b9af93-ca3f-42e4-b870-00d59cb5835f	Cloud	cloud	2026-02-10 15:55:51.917
67d75664-f463-4059-b74e-4900e8419486	AI	ai	2026-02-10 15:55:51.917
0c106268-738b-49d6-a21c-e48acf73ac6d	Mobile	mobile	2026-02-10 15:55:51.917
cbbf9ea6-df09-4925-976b-2b0e9d2f82e7	Robotics	robotics	2026-02-10 15:55:51.917
d6c3adc3-94ab-492a-b378-a6a06aece45e	Blockchain	blockchain	2026-02-10 15:55:51.917
cde77235-036d-4bce-8138-87dd8d4ea649	Data Science	data-science	2026-02-10 15:55:51.917
91e0d092-2610-4d41-9f60-1dc8859e9cd2	React	react	2026-02-15 08:44:34.79
0329abd7-87da-423f-bd12-6c5a89e36c4a	Node	node	2026-02-17 17:40:02.285
09d58909-88e3-479c-8ca5-295eadba8b61	Javascript	javascript	2026-02-17 17:41:58.539
cea82fbb-7897-470c-982b-5d7194d94aa1	HTML	html	2026-02-17 17:41:58.539
004dd924-cc5f-4a76-9b55-78e3adf6064b	Arduino Uno	arduino-uno	2026-02-17 17:41:58.539
fcb21b8e-f57e-4549-9fc7-c89bfb28d390	Python	python	2026-02-17 17:41:58.539
4390ed9d-a621-4646-aae6-ed0f79518726	SP32	sp32	2026-02-17 17:41:58.539
6916a409-5c3c-49ca-9d86-9ec6a4959daa	MongoDB	mongodb	2026-02-17 19:46:00.903
6bb12b31-202f-4ca0-987e-642d847b889a	Express	express	2026-02-17 19:46:00.903
6e06251f-9979-4af2-ba68-f14b95ba2f7b	PostgreSQL	postgresql	2026-02-17 19:49:22.447
f1c54510-742b-43af-bec5-2aaac9fa335b	Next	next	2026-02-18 07:19:17.699
9487e1b3-c64b-4ad1-a012-3f9f898e99ec	AWS	aws	2026-02-18 07:19:17.699
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, username, email, password, bio, "profileImage", "emailVerified", "createdAt", "updatedAt") FROM stdin;
temp-user-001	Dev User	devuser	dev@devmerge.com	\N	Temporary development user	\N	\N	2026-02-12 06:42:50.024	2026-02-12 06:42:50.024
70e8bead-e2f8-4c0f-8225-ca0ad2adbd69	Test User	testuser	test@example.com	$2b$10$eh6UCt42Xh2oMModNU9DWenZV1yFTYvP3nIRjYAzJLp/XmzeYpfFq	\N	\N	\N	2026-02-14 13:33:42.6	2026-02-14 13:33:42.6
556f0c24-bf24-4176-816b-783575c7a647	Test User	testuser1	test@test.com	$2b$10$QAbSdAN6AMM/Mx4VVPMa.OViaOuVtyc.JVi8csQAoXgNh5Drm.Oru	\N	\N	\N	2026-02-14 13:56:50.359	2026-02-14 13:56:50.359
3af0e19c-2ff9-41a9-95c9-2f3bee8cbbd9	junjun loveyu	junjun	junjun@devmerge.com	$2b$10$P5ZCYoweHAESP/D2a0uF5.6o08NQ4sSkkLoU0nK1Mj4S9QuTKTEZS	\N	\N	\N	2026-02-17 17:06:06.543	2026-02-17 17:06:06.543
3b137f8f-9957-43fc-b5c3-1a27d55ce2d7	Feevol Into	feevol	feevol@devmerge.com	$2b$10$LVsx1sdWZCZfJi98/YnL7uGKsRH1e8frMVCC7bFath53YY56NufsS	A professional vibe coder and prompt engineer. XDD	\N	\N	2026-02-17 17:30:19.478	2026-02-17 17:31:04.254
32e12459-be79-433f-bd46-fb5ba0cba39a	Pebble Bato	pebble_	carol@devmerge.com	$2b$10$lMGRq/EXRnCCW/QQL1fJyeDzJbE5LD2EZbed0NxzaTbo5t27MlJm2	Frontend developer and UX enthusiast	https://api.dicebear.com/7.x/avataaars/svg?seed=Carol	\N	2026-02-10 15:55:50.762	2026-02-17 19:46:49.238
75d677aa-61d3-4733-a6dd-ab61854ebd43	Fishbol	fishbol	alice@devmerge.com	$2b$10$lMGRq/EXRnCCW/QQL1fJyeDzJbE5LD2EZbed0NxzaTbo5t27MlJm2	Full-stack developer passionate about AI and machine learning. also a professional vibe coder	https://api.dicebear.com/7.x/avataaars/svg?seed=Alice	\N	2026-02-10 15:55:50.762	2026-02-17 19:50:21.512
0b65df5a-75c6-4625-91d9-76a69c25ad39	Alter Ego ni Feevol	AlterFeevol	david@devmerge.com	$2b$10$lMGRq/EXRnCCW/QQL1fJyeDzJbE5LD2EZbed0NxzaTbo5t27MlJm2	Mobile developer building cross-platform apps	https://api.dicebear.com/7.x/avataaars/svg?seed=David	\N	2026-02-10 15:55:50.762	2026-02-17 19:51:38.892
78ba3833-1a8f-42ea-8125-cb71fbbc792e	Pebol	pebol	bob@devmerge.com	$2b$10$lMGRq/EXRnCCW/QQL1fJyeDzJbE5LD2EZbed0NxzaTbo5t27MlJm2	Backend engineer with expertise in cloud architecture	https://api.dicebear.com/7.x/avataaars/svg?seed=Bob	\N	2026-02-10 15:55:50.762	2026-02-17 19:54:41.744
de939a16-5336-4bdd-bbee-01cf1bc45ace	Test User	testuser2	test2@test.com	$2b$10$bmr7oqkpx6nWTQCoLfHElO/kH2KvJ/C7mk75DqvM1wR6jqCOqoF36	\N	\N	\N	2026-02-18 08:34:22.6	2026-02-18 08:34:22.6
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: GroupMember GroupMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_pkey" PRIMARY KEY (id);


--
-- Name: GroupTag GroupTag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupTag"
    ADD CONSTRAINT "GroupTag_pkey" PRIMARY KEY ("groupId", "tagId");


--
-- Name: Group Group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Account_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Account_userId_idx" ON public."Account" USING btree ("userId");


--
-- Name: GroupMember_groupId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "GroupMember_groupId_idx" ON public."GroupMember" USING btree ("groupId");


--
-- Name: GroupMember_groupId_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON public."GroupMember" USING btree ("groupId", "userId");


--
-- Name: GroupMember_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "GroupMember_userId_idx" ON public."GroupMember" USING btree ("userId");


--
-- Name: GroupTag_groupId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "GroupTag_groupId_idx" ON public."GroupTag" USING btree ("groupId");


--
-- Name: GroupTag_tagId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "GroupTag_tagId_idx" ON public."GroupTag" USING btree ("tagId");


--
-- Name: Group_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Group_createdAt_idx" ON public."Group" USING btree ("createdAt");


--
-- Name: Group_creatorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Group_creatorId_idx" ON public."Group" USING btree ("creatorId");


--
-- Name: Group_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Group_isActive_idx" ON public."Group" USING btree ("isActive");


--
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- Name: Notification_userId_isRead_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_userId_isRead_idx" ON public."Notification" USING btree ("userId", "isRead");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: Tag_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tag_slug_idx" ON public."Tag" USING btree (slug);


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_username_idx" ON public."User" USING btree (username);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupMember GroupMember_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupMember GroupMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupTag GroupTag_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupTag"
    ADD CONSTRAINT "GroupTag_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."Group"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GroupTag GroupTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GroupTag"
    ADD CONSTRAINT "GroupTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Group Group_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT "Group_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict i4H3z8tPsZGA1ofPEJgkCS98TxLmtGdMP4vIjg03hsdeI7ERpSsMZlGhKtK4dcD

