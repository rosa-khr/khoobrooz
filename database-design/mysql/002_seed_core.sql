SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

USE khoobrooz;

INSERT INTO countries (name_fa, name_en, iso2, iso3, phone_code, capital, currency_code, timezone_default, flag, sort_order, accuracy)
VALUES
  ('افغانستان', 'Afghanistan', 'AF', 'AFG', NULL, 'Kabul', NULL, NULL, 'AF', 10, 1),
  ('جزایر آلاند', 'Aland Islands', 'AX', 'ALA', NULL, 'Mariehamn', NULL, NULL, 'AX', 20, 1),
  ('آلبانی', 'Albania', 'AL', 'ALB', NULL, 'Tirana', NULL, NULL, 'AL', 30, 1),
  ('الجزایر', 'Algeria', 'DZ', 'DZA', NULL, 'Algiers', NULL, NULL, 'DZ', 40, 1),
  ('آندورا', 'Andorra', 'AD', 'AND', NULL, 'Andorra la Vella', NULL, NULL, 'AD', 50, 1),
  ('آنگولا', 'Angola', 'AO', 'AGO', NULL, 'Luanda', NULL, NULL, 'AO', 60, 1),
  ('آنگویلا', 'Anguilla', 'AI', 'AIA', NULL, 'The Valley', NULL, NULL, 'AI', 70, 1),
  ('جنوبگان', 'Antarctica', 'AQ', 'ATA', NULL, NULL, NULL, NULL, 'AQ', 80, 1),
  ('آنتیگوا و باربودا', 'Antigua and Barbuda', 'AG', 'ATG', NULL, 'St. John''s', NULL, NULL, 'AG', 90, 1),
  ('آرژانتین', 'Argentina', 'AR', 'ARG', NULL, 'Buenos Aires', NULL, NULL, 'AR', 100, 1),
  ('ارمنستان', 'Armenia', 'AM', 'ARM', NULL, 'Yerevan', NULL, NULL, 'AM', 110, 1),
  ('آروبا', 'Aruba', 'AW', 'ABW', NULL, 'Oranjestad', NULL, NULL, 'AW', 120, 1),
  ('استرالیا', 'Australia', 'AU', 'AUS', NULL, 'Canberra', NULL, NULL, 'AU', 130, 1),
  ('اتریش', 'Austria', 'AT', 'AUT', NULL, 'Vienna', NULL, NULL, 'AT', 140, 1),
  ('جمهوری آذربایجان', 'Azerbaijan', 'AZ', 'AZE', NULL, 'Baku', NULL, NULL, 'AZ', 150, 1),
  ('باهاما', 'Bahamas', 'BS', 'BHS', NULL, 'Nassau', NULL, NULL, 'BS', 160, 1),
  ('بحرین', 'Bahrain', 'BH', 'BHR', NULL, 'Manama', NULL, NULL, 'BH', 170, 1),
  ('بنگلادش', 'Bangladesh', 'BD', 'BGD', NULL, 'Dhaka', NULL, NULL, 'BD', 180, 1),
  ('باربادوس', 'Barbados', 'BB', 'BRB', NULL, 'Bridgetown', NULL, NULL, 'BB', 190, 1),
  ('بلاروس', 'Belarus', 'BY', 'BLR', NULL, 'Minsk', NULL, NULL, 'BY', 200, 1),
  ('بلژیک', 'Belgium', 'BE', 'BEL', NULL, 'Brussels', NULL, NULL, 'BE', 210, 1),
  ('بلیز', 'Belize', 'BZ', 'BLZ', NULL, 'Belmopan', NULL, NULL, 'BZ', 220, 1),
  ('بنین', 'Benin', 'BJ', 'BEN', NULL, 'Porto-Novo', NULL, NULL, 'BJ', 230, 1),
  ('برمودا', 'Bermuda', 'BM', 'BMU', NULL, 'Hamilton', NULL, NULL, 'BM', 240, 1),
  ('بوتان', 'Bhutan', 'BT', 'BTN', NULL, 'Thimphu', NULL, NULL, 'BT', 250, 1),
  ('بولیوی', 'Bolivia', 'BO', 'BOL', NULL, 'Sucre', NULL, NULL, 'BO', 260, 1),
  ('جزایر کارائیب هلند', 'Bonaire, Saint Eustatius and Saba ', 'BQ', 'BES', NULL, NULL, NULL, NULL, 'BQ', 270, 1),
  ('بوسنی و هرزگوین', 'Bosnia and Herzegovina', 'BA', 'BIH', NULL, 'Sarajevo', NULL, NULL, 'BA', 280, 1),
  ('بوتسوانا', 'Botswana', 'BW', 'BWA', NULL, 'Gaborone', NULL, NULL, 'BW', 290, 1),
  ('جزیرهٔ بووه', 'Bouvet Island', 'BV', 'BVT', NULL, NULL, NULL, NULL, 'BV', 300, 1),
  ('برزیل', 'Brazil', 'BR', 'BRA', NULL, 'Brasilia', NULL, NULL, 'BR', 310, 1),
  ('قلمرو بریتانیا در اقیانوس هند', 'British Indian Ocean Territory', 'IO', 'IOT', NULL, 'Diego Garcia', NULL, NULL, 'IO', 320, 1),
  ('جزایر ویرجین بریتانیا', 'British Virgin Islands', 'VG', 'VGB', NULL, 'Road Town', NULL, NULL, 'VG', 330, 1),
  ('برونئی', 'Brunei', 'BN', 'BRN', NULL, 'Bandar Seri Begawan', NULL, NULL, 'BN', 340, 1),
  ('بلغارستان', 'Bulgaria', 'BG', 'BGR', NULL, 'Sofia', NULL, NULL, 'BG', 350, 1),
  ('بورکینافاسو', 'Burkina Faso', 'BF', 'BFA', NULL, 'Ouagadougou', NULL, NULL, 'BF', 360, 1),
  ('بوروندی', 'Burundi', 'BI', 'BDI', NULL, 'Bujumbura', NULL, NULL, 'BI', 370, 1),
  ('کامبوج', 'Cambodia', 'KH', 'KHM', NULL, 'Phnom Penh', NULL, NULL, 'KH', 380, 1),
  ('کامرون', 'Cameroon', 'CM', 'CMR', NULL, 'Yaounde', NULL, NULL, 'CM', 390, 1),
  ('کانادا', 'Canada', 'CA', 'CAN', NULL, 'Ottawa', NULL, NULL, 'CA', 400, 1),
  ('کیپ‌ورد', 'Cape Verde', 'CV', 'CPV', NULL, 'Praia', NULL, NULL, 'CV', 410, 1),
  ('جزایر کِیمن', 'Cayman Islands', 'KY', 'CYM', NULL, 'George Town', NULL, NULL, 'KY', 420, 1),
  ('جمهوری افریقای مرکزی', 'Central African Republic', 'CF', 'CAF', NULL, 'Bangui', NULL, NULL, 'CF', 430, 1),
  ('چاد', 'Chad', 'TD', 'TCD', NULL, 'N''Djamena', NULL, NULL, 'TD', 440, 1),
  ('شیلی', 'Chile', 'CL', 'CHL', NULL, 'Santiago', NULL, NULL, 'CL', 450, 1),
  ('چین', 'China', 'CN', 'CHN', NULL, 'Beijing', NULL, NULL, 'CN', 460, 1),
  ('جزیرهٔ کریسمس', 'Christmas Island', 'CX', 'CXR', NULL, 'Flying Fish Cove', NULL, NULL, 'CX', 470, 1),
  ('جزایر کوکوس', 'Cocos (Keeling) Islands', 'CC', 'CCK', NULL, 'West Island', NULL, NULL, 'CC', 480, 1),
  ('کلمبیا', 'Colombia', 'CO', 'COL', NULL, 'Bogota', NULL, NULL, 'CO', 490, 1),
  ('کومور', 'Comoros', 'KM', 'COM', NULL, 'Moroni', NULL, NULL, 'KM', 500, 1),
  ('کنگو - برازویل', 'Congo', 'CG', 'COG', NULL, 'Brazzaville', NULL, NULL, 'CG', 510, 1),
  ('جزایر کوک', 'Cook Islands', 'CK', 'COK', NULL, 'Avarua', NULL, NULL, 'CK', 520, 1),
  ('کاستاریکا', 'Costa Rica', 'CR', 'CRI', NULL, 'San Jose', NULL, NULL, 'CR', 530, 1),
  ('کرواسی', 'Croatia', 'HR', 'HRV', NULL, 'Zagreb', NULL, NULL, 'HR', 540, 1),
  ('کوبا', 'Cuba', 'CU', 'CUB', NULL, 'Havana', NULL, NULL, 'CU', 550, 1),
  ('کوراسائو', 'Curacao', 'CW', 'CUW', NULL, ' Willemstad', NULL, NULL, 'CW', 560, 1),
  ('قبرس', 'Cyprus', 'CY', 'CYP', NULL, 'Nicosia', NULL, NULL, 'CY', 570, 1),
  ('چک', 'Czech Republic', 'CZ', 'CZE', NULL, 'Prague', NULL, NULL, 'CZ', 580, 1),
  ('کنگو - کینشاسا', 'Democratic Republic of the Congo', 'CD', 'COD', NULL, 'Kinshasa', NULL, NULL, 'CD', 590, 1),
  ('دانمارک', 'Denmark', 'DK', 'DNK', NULL, 'Copenhagen', NULL, NULL, 'DK', 600, 1),
  ('جیبوتی', 'Djibouti', 'DJ', 'DJI', NULL, 'Djibouti', NULL, NULL, 'DJ', 610, 1),
  ('دومینیکا', 'Dominica', 'DM', 'DMA', NULL, 'Roseau', NULL, NULL, 'DM', 620, 1),
  ('جمهوری دومینیکن', 'Dominican Republic', 'DO', 'DOM', NULL, 'Santo Domingo', NULL, NULL, 'DO', 630, 1),
  ('اکوادور', 'Ecuador', 'EC', 'ECU', NULL, 'Quito', NULL, NULL, 'EC', 640, 1),
  ('مصر', 'Egypt', 'EG', 'EGY', NULL, 'Cairo', NULL, NULL, 'EG', 650, 1),
  ('السالوادور', 'El Salvador', 'SV', 'SLV', NULL, 'San Salvador', NULL, NULL, 'SV', 660, 1),
  ('گینهٔ استوایی', 'Equatorial Guinea', 'GQ', 'GNQ', NULL, 'Malabo', NULL, NULL, 'GQ', 670, 1),
  ('اریتره', 'Eritrea', 'ER', 'ERI', NULL, 'Asmara', NULL, NULL, 'ER', 680, 1),
  ('استونی', 'Estonia', 'EE', 'EST', NULL, 'Tallinn', NULL, NULL, 'EE', 690, 1),
  ('اتیوپی', 'Ethiopia', 'ET', 'ETH', NULL, 'Addis Ababa', NULL, NULL, 'ET', 700, 1),
  ('جزایر فالکلند', 'Falkland Islands', 'FK', 'FLK', NULL, 'Stanley', NULL, NULL, 'FK', 710, 1),
  ('جزایر فارو', 'Faroe Islands', 'FO', 'FRO', NULL, 'Torshavn', NULL, NULL, 'FO', 720, 1),
  ('فیجی', 'Fiji', 'FJ', 'FJI', NULL, 'Suva', NULL, NULL, 'FJ', 730, 1),
  ('فنلاند', 'Finland', 'FI', 'FIN', NULL, 'Helsinki', NULL, NULL, 'FI', 740, 1),
  ('فرانسه', 'France', 'FR', 'FRA', NULL, 'Paris', NULL, NULL, 'FR', 750, 1),
  ('پلی‌نزی فرانسه', 'French Polynesia', 'PF', 'PYF', NULL, 'Papeete', NULL, NULL, 'PF', 760, 1),
  ('سرزمین‌های جنوبی فرانسه', 'French Southern Territories', 'TF', 'ATF', NULL, 'Port-aux-Francais', NULL, NULL, 'TF', 770, 1),
  ('گابن', 'Gabon', 'GA', 'GAB', NULL, 'Libreville', NULL, NULL, 'GA', 780, 1),
  ('گامبیا', 'Gambia', 'GM', 'GMB', NULL, 'Banjul', NULL, NULL, 'GM', 790, 1),
  ('گرجستان', 'Georgia', 'GE', 'GEO', NULL, 'Tbilisi', NULL, NULL, 'GE', 800, 1),
  ('آلمان', 'Germany', 'DE', 'DEU', NULL, 'Berlin', NULL, NULL, 'DE', 810, 1),
  ('غنا', 'Ghana', 'GH', 'GHA', NULL, 'Accra', NULL, NULL, 'GH', 820, 1),
  ('جبل‌الطارق', 'Gibraltar', 'GI', 'GIB', NULL, 'Gibraltar', NULL, NULL, 'GI', 830, 1),
  ('یونان', 'Greece', 'GR', 'GRC', NULL, 'Athens', NULL, NULL, 'GR', 840, 1),
  ('گرینلند', 'Greenland', 'GL', 'GRL', NULL, 'Nuuk', NULL, NULL, 'GL', 850, 1),
  ('گرنادا', 'Grenada', 'GD', 'GRD', NULL, 'St. George''s', NULL, NULL, 'GD', 860, 1),
  ('گوادلوپ', 'Guadeloupe', 'GP', 'GLP', NULL, 'Basse-Terre', NULL, NULL, 'GP', 870, 1),
  ('گوام', 'Guam', 'GU', 'GUM', NULL, 'Hagatna', NULL, NULL, 'GU', 880, 1),
  ('گواتمالا', 'Guatemala', 'GT', 'GTM', NULL, 'Guatemala City', NULL, NULL, 'GT', 890, 1),
  ('گرنزی', 'Guernsey', 'GG', 'GGY', NULL, 'St Peter Port', NULL, NULL, 'GG', 900, 1),
  ('گینه', 'Guinea', 'GN', 'GIN', NULL, 'Conakry', NULL, NULL, 'GN', 910, 1),
  ('گینهٔ بیسائو', 'Guinea-Bissau', 'GW', 'GNB', NULL, 'Bissau', NULL, NULL, 'GW', 920, 1),
  ('گویان', 'Guyana', 'GY', 'GUY', NULL, 'Georgetown', NULL, NULL, 'GY', 930, 1),
  ('هائیتی', 'Haiti', 'HT', 'HTI', NULL, 'Port-au-Prince', NULL, NULL, 'HT', 940, 1),
  ('هرد و جزایر مک‌دونالد', 'Heard Island and McDonald Islands', 'HM', 'HMD', NULL, NULL, NULL, NULL, 'HM', 950, 1),
  ('هندوراس', 'Honduras', 'HN', 'HND', NULL, 'Tegucigalpa', NULL, NULL, 'HN', 960, 1),
  ('هنگ‌کنگ، منطقهٔ ویژهٔ اداری چین', 'Hong Kong', 'HK', 'HKG', NULL, 'Hong Kong', NULL, NULL, 'HK', 970, 1),
  ('مجارستان', 'Hungary', 'HU', 'HUN', NULL, 'Budapest', NULL, NULL, 'HU', 980, 1),
  ('ایسلند', 'Iceland', 'IS', 'ISL', NULL, 'Reykjavik', NULL, NULL, 'IS', 990, 1),
  ('هند', 'India', 'IN', 'IND', NULL, 'New Delhi', NULL, NULL, 'IN', 1000, 1),
  ('اندونزی', 'Indonesia', 'ID', 'IDN', NULL, 'Jakarta', NULL, NULL, 'ID', 1010, 1),
  ('ایران', 'Iran', 'IR', 'IRN', NULL, 'Tehran', NULL, NULL, 'IR', 1020, 1),
  ('عراق', 'Iraq', 'IQ', 'IRQ', NULL, 'Baghdad', NULL, NULL, 'IQ', 1030, 1),
  ('ایرلند', 'Ireland', 'IE', 'IRL', NULL, 'Dublin', NULL, NULL, 'IE', 1040, 1),
  ('جزیرهٔ من', 'Isle of Man', 'IM', 'IMN', NULL, 'Douglas, Isle of Man', NULL, NULL, 'IM', 1050, 1),
  ('اسرائیل', 'Israel', 'IL', 'ISR', NULL, 'Jerusalem', NULL, NULL, 'IL', 1060, 1),
  ('ایتالیا', 'Italy', 'IT', 'ITA', NULL, 'Rome', NULL, NULL, 'IT', 1070, 1),
  ('ساحل عاج', 'Ivory Coast', 'CI', 'CIV', NULL, 'Yamoussoukro', NULL, NULL, 'CI', 1080, 1),
  ('جامائیکا', 'Jamaica', 'JM', 'JAM', NULL, 'Kingston', NULL, NULL, 'JM', 1090, 1),
  ('ژاپن', 'Japan', 'JP', 'JPN', NULL, 'Tokyo', NULL, NULL, 'JP', 1100, 1),
  ('جرزی', 'Jersey', 'JE', 'JEY', NULL, 'Saint Helier', NULL, NULL, 'JE', 1110, 1),
  ('اردن', 'Jordan', 'JO', 'JOR', NULL, 'Amman', NULL, NULL, 'JO', 1120, 1),
  ('قزاقستان', 'Kazakhstan', 'KZ', 'KAZ', NULL, 'Astana', NULL, NULL, 'KZ', 1130, 1),
  ('کنیا', 'Kenya', 'KE', 'KEN', NULL, 'Nairobi', NULL, NULL, 'KE', 1140, 1),
  ('کیریباتی', 'Kiribati', 'KI', 'KIR', NULL, 'Tarawa', NULL, NULL, 'KI', 1150, 1),
  ('کوزوو', 'Kosovo', 'XK', 'XKX', NULL, 'Pristina', NULL, NULL, 'XK', 1160, 1),
  ('کویت', 'Kuwait', 'KW', 'KWT', NULL, 'Kuwait City', NULL, NULL, 'KW', 1170, 1),
  ('قرقیزستان', 'Kyrgyzstan', 'KG', 'KGZ', NULL, 'Bishkek', NULL, NULL, 'KG', 1180, 1),
  ('لائوس', 'Laos', 'LA', 'LAO', NULL, 'Vientiane', NULL, NULL, 'LA', 1190, 1),
  ('لتونی', 'Latvia', 'LV', 'LVA', NULL, 'Riga', NULL, NULL, 'LV', 1200, 1),
  ('لبنان', 'Lebanon', 'LB', 'LBN', NULL, 'Beirut', NULL, NULL, 'LB', 1210, 1),
  ('لسوتو', 'Lesotho', 'LS', 'LSO', NULL, 'Maseru', NULL, NULL, 'LS', 1220, 1),
  ('لیبریا', 'Liberia', 'LR', 'LBR', NULL, 'Monrovia', NULL, NULL, 'LR', 1230, 1),
  ('لیبی', 'Libya', 'LY', 'LBY', NULL, 'Tripolis', NULL, NULL, 'LY', 1240, 1),
  ('لیختن‌اشتاین', 'Liechtenstein', 'LI', 'LIE', NULL, 'Vaduz', NULL, NULL, 'LI', 1250, 1),
  ('لیتوانی', 'Lithuania', 'LT', 'LTU', NULL, 'Vilnius', NULL, NULL, 'LT', 1260, 1),
  ('لوکزامبورگ', 'Luxembourg', 'LU', 'LUX', NULL, 'Luxembourg', NULL, NULL, 'LU', 1270, 1),
  ('ماکائو، منطقهٔ ویژهٔ اداری چین', 'Macau', 'MO', 'MAC', NULL, 'Macao', NULL, NULL, 'MO', 1280, 1),
  ('مقدونیهٔ شمالی', 'Macedonia', 'MK', 'MKD', NULL, 'Skopje', NULL, NULL, 'MK', 1290, 1),
  ('ماداگاسکار', 'Madagascar', 'MG', 'MDG', NULL, 'Antananarivo', NULL, NULL, 'MG', 1300, 1),
  ('مالاوی', 'Malawi', 'MW', 'MWI', NULL, 'Lilongwe', NULL, NULL, 'MW', 1310, 1),
  ('مالزی', 'Malaysia', 'MY', 'MYS', NULL, 'Kuala Lumpur', NULL, NULL, 'MY', 1320, 1),
  ('مالدیو', 'Maldives', 'MV', 'MDV', NULL, 'Male', NULL, NULL, 'MV', 1330, 1),
  ('مالی', 'Mali', 'ML', 'MLI', NULL, 'Bamako', NULL, NULL, 'ML', 1340, 1),
  ('مالت', 'Malta', 'MT', 'MLT', NULL, 'Valletta', NULL, NULL, 'MT', 1350, 1),
  ('جزایر مارشال', 'Marshall Islands', 'MH', 'MHL', NULL, 'Majuro', NULL, NULL, 'MH', 1360, 1),
  ('مارتینیک', 'Martinique', 'MQ', 'MTQ', NULL, 'Fort-de-France', NULL, NULL, 'MQ', 1370, 1),
  ('موریتانی', 'Mauritania', 'MR', 'MRT', NULL, 'Nouakchott', NULL, NULL, 'MR', 1380, 1),
  ('موریس', 'Mauritius', 'MU', 'MUS', NULL, 'Port Louis', NULL, NULL, 'MU', 1390, 1),
  ('مایوت', 'Mayotte', 'YT', 'MYT', NULL, 'Mamoudzou', NULL, NULL, 'YT', 1400, 1),
  ('مکزیک', 'Mexico', 'MX', 'MEX', NULL, 'Mexico City', NULL, NULL, 'MX', 1410, 1),
  ('میکرونزی', 'Micronesia', 'FM', 'FSM', NULL, 'Palikir', NULL, NULL, 'FM', 1420, 1),
  ('مولداوی', 'Moldova', 'MD', 'MDA', NULL, 'Chisinau', NULL, NULL, 'MD', 1430, 1),
  ('موناکو', 'Monaco', 'MC', 'MCO', NULL, 'Monaco', NULL, NULL, 'MC', 1440, 1),
  ('مغولستان', 'Mongolia', 'MN', 'MNG', NULL, 'Ulan Bator', NULL, NULL, 'MN', 1450, 1),
  ('مونته‌نگرو', 'Montenegro', 'ME', 'MNE', NULL, 'Podgorica', NULL, NULL, 'ME', 1460, 1),
  ('مونت‌سرات', 'Montserrat', 'MS', 'MSR', NULL, 'Plymouth', NULL, NULL, 'MS', 1470, 1),
  ('مراکش', 'Morocco', 'MA', 'MAR', NULL, 'Rabat', NULL, NULL, 'MA', 1480, 1),
  ('موزامبیک', 'Mozambique', 'MZ', 'MOZ', NULL, 'Maputo', NULL, NULL, 'MZ', 1490, 1),
  ('میانمار (برمه)', 'Myanmar', 'MM', 'MMR', NULL, 'Nay Pyi Taw', NULL, NULL, 'MM', 1500, 1),
  ('نامیبیا', 'Namibia', 'NA', 'NAM', NULL, 'Windhoek', NULL, NULL, 'NA', 1510, 1),
  ('نائورو', 'Nauru', 'NR', 'NRU', NULL, 'Yaren', NULL, NULL, 'NR', 1520, 1),
  ('نپال', 'Nepal', 'NP', 'NPL', NULL, 'Kathmandu', NULL, NULL, 'NP', 1530, 1),
  ('هلند', 'Netherlands', 'NL', 'NLD', NULL, 'Amsterdam', NULL, NULL, 'NL', 1540, 1),
  ('کالدونیای جدید', 'New Caledonia', 'NC', 'NCL', NULL, 'Noumea', NULL, NULL, 'NC', 1550, 1),
  ('نیوزیلند', 'New Zealand', 'NZ', 'NZL', NULL, 'Wellington', NULL, NULL, 'NZ', 1560, 1),
  ('نیکاراگوئه', 'Nicaragua', 'NI', 'NIC', NULL, 'Managua', NULL, NULL, 'NI', 1570, 1),
  ('نیجر', 'Niger', 'NE', 'NER', NULL, 'Niamey', NULL, NULL, 'NE', 1580, 1),
  ('نیجریه', 'Nigeria', 'NG', 'NGA', NULL, 'Abuja', NULL, NULL, 'NG', 1590, 1),
  ('نیوئه', 'Niue', 'NU', 'NIU', NULL, 'Alofi', NULL, NULL, 'NU', 1600, 1),
  ('جزیرهٔ نورفولک', 'Norfolk Island', 'NF', 'NFK', NULL, 'Kingston', NULL, NULL, 'NF', 1610, 1),
  ('کرهٔ شمالی', 'North Korea', 'KP', 'PRK', NULL, 'Pyongyang', NULL, NULL, 'KP', 1620, 1),
  ('جزایر ماریانای شمالی', 'Northern Mariana Islands', 'MP', 'MNP', NULL, 'Saipan', NULL, NULL, 'MP', 1630, 1),
  ('نروژ', 'Norway', 'NO', 'NOR', NULL, 'Oslo', NULL, NULL, 'NO', 1640, 1),
  ('عمان', 'Oman', 'OM', 'OMN', NULL, 'Muscat', NULL, NULL, 'OM', 1650, 1),
  ('پاکستان', 'Pakistan', 'PK', 'PAK', NULL, 'Islamabad', NULL, NULL, 'PK', 1660, 1),
  ('پالائو', 'Palau', 'PW', 'PLW', NULL, 'Melekeok', NULL, NULL, 'PW', 1670, 1),
  ('سرزمین‌های فلسطینی', 'Palestinian Territory', 'PS', 'PSE', NULL, 'East Jerusalem', NULL, NULL, 'PS', 1680, 1),
  ('پاناما', 'Panama', 'PA', 'PAN', NULL, 'Panama City', NULL, NULL, 'PA', 1690, 1),
  ('پاپوا گینهٔ نو', 'Papua New Guinea', 'PG', 'PNG', NULL, 'Port Moresby', NULL, NULL, 'PG', 1700, 1),
  ('پاراگوئه', 'Paraguay', 'PY', 'PRY', NULL, 'Asuncion', NULL, NULL, 'PY', 1710, 1),
  ('پرو', 'Peru', 'PE', 'PER', NULL, 'Lima', NULL, NULL, 'PE', 1720, 1),
  ('فیلیپین', 'Philippines', 'PH', 'PHL', NULL, 'Manila', NULL, NULL, 'PH', 1730, 1),
  ('جزایر پیت‌کرن', 'Pitcairn', 'PN', 'PCN', NULL, 'Adamstown', NULL, NULL, 'PN', 1740, 1),
  ('لهستان', 'Poland', 'PL', 'POL', NULL, 'Warsaw', NULL, NULL, 'PL', 1750, 1),
  ('پرتغال', 'Portugal', 'PT', 'PRT', NULL, 'Lisbon', NULL, NULL, 'PT', 1760, 1),
  ('پورتوریکو', 'Puerto Rico', 'PR', 'PRI', NULL, 'San Juan', NULL, NULL, 'PR', 1770, 1),
  ('قطر', 'Qatar', 'QA', 'QAT', NULL, 'Doha', NULL, NULL, 'QA', 1780, 1),
  ('رئونیون', 'Réunion', 'RE', 'REU', NULL, 'Saint-Denis', NULL, NULL, 'RE', 1790, 1),
  ('رومانی', 'Romania', 'RO', 'ROU', NULL, 'Bucharest', NULL, NULL, 'RO', 1800, 1),
  ('روسیه', 'Russia', 'RU', 'RUS', NULL, 'Moscow', NULL, NULL, 'RU', 1810, 1),
  ('رواندا', 'Rwanda', 'RW', 'RWA', NULL, 'Kigali', NULL, NULL, 'RW', 1820, 1),
  ('سن بارتلمی', 'Saint Barthelemy', 'BL', 'BLM', NULL, 'Gustavia', NULL, NULL, 'BL', 1830, 1),
  ('سنت هلن', 'Saint Helena', 'SH', 'SHN', NULL, 'Jamestown', NULL, NULL, 'SH', 1840, 1),
  ('سنت کیتس و نویس', 'Saint Kitts and Nevis', 'KN', 'KNA', NULL, 'Basseterre', NULL, NULL, 'KN', 1850, 1),
  ('سنت لوسیا', 'Saint Lucia', 'LC', 'LCA', NULL, 'Castries', NULL, NULL, 'LC', 1860, 1),
  ('سنت مارتین', 'Saint Martin', 'MF', 'MAF', NULL, 'Marigot', NULL, NULL, 'MF', 1870, 1),
  ('سن پیر و میکلن', 'Saint Pierre and Miquelon', 'PM', 'SPM', NULL, 'Saint-Pierre', NULL, NULL, 'PM', 1880, 1),
  ('سنت وینسنت و گرنادین', 'Saint Vincent and the Grenadines', 'VC', 'VCT', NULL, 'Kingstown', NULL, NULL, 'VC', 1890, 1),
  ('ساموآ', 'Samoa', 'WS', 'WSM', NULL, 'Apia', NULL, NULL, 'WS', 1900, 1),
  ('سان‌مارینو', 'San Marino', 'SM', 'SMR', NULL, 'San Marino', NULL, NULL, 'SM', 1910, 1),
  ('سائوتومه و پرینسیپ', 'Sao Tome and Principe', 'ST', 'STP', NULL, 'Sao Tome', NULL, NULL, 'ST', 1920, 1),
  ('عربستان سعودی', 'Saudi Arabia', 'SA', 'SAU', NULL, 'Riyadh', NULL, NULL, 'SA', 1930, 1),
  ('سنگال', 'Senegal', 'SN', 'SEN', NULL, 'Dakar', NULL, NULL, 'SN', 1940, 1),
  ('صربستان', 'Serbia', 'RS', 'SRB', NULL, 'Belgrade', NULL, NULL, 'RS', 1950, 1),
  ('سیشل', 'Seychelles', 'SC', 'SYC', NULL, 'Victoria', NULL, NULL, 'SC', 1960, 1),
  ('سیرالئون', 'Sierra Leone', 'SL', 'SLE', NULL, 'Freetown', NULL, NULL, 'SL', 1970, 1),
  ('سنگاپور', 'Singapore', 'SG', 'SGP', NULL, 'Singapur', NULL, NULL, 'SG', 1980, 1),
  ('سنت مارتن', 'Sint Maarten', 'SX', 'SXM', NULL, 'Philipsburg', NULL, NULL, 'SX', 1990, 1),
  ('اسلواکی', 'Slovakia', 'SK', 'SVK', NULL, 'Bratislava', NULL, NULL, 'SK', 2000, 1),
  ('اسلوونی', 'Slovenia', 'SI', 'SVN', NULL, 'Ljubljana', NULL, NULL, 'SI', 2010, 1),
  ('جزایر سلیمان', 'Solomon Islands', 'SB', 'SLB', NULL, 'Honiara', NULL, NULL, 'SB', 2020, 1),
  ('سومالی', 'Somalia', 'SO', 'SOM', NULL, 'Mogadishu', NULL, NULL, 'SO', 2030, 1),
  ('افریقای جنوبی', 'South Africa', 'ZA', 'ZAF', NULL, 'Pretoria', NULL, NULL, 'ZA', 2040, 1),
  ('جورجیای جنوبی و جزایر ساندویچ جنوبی', 'South Georgia and the South Sandwich Islands', 'GS', 'SGS', NULL, 'Grytviken', NULL, NULL, 'GS', 2050, 1),
  ('کرهٔ جنوبی', 'South Korea', 'KR', 'KOR', NULL, 'Seoul', NULL, NULL, 'KR', 2060, 1),
  ('سودان جنوبی', 'South Sudan', 'SS', 'SSD', NULL, 'Juba', NULL, NULL, 'SS', 2070, 1),
  ('اسپانیا', 'Spain', 'ES', 'ESP', NULL, 'Madrid', NULL, NULL, 'ES', 2080, 1),
  ('سری‌لانکا', 'Sri Lanka', 'LK', 'LKA', NULL, 'Colombo', NULL, NULL, 'LK', 2090, 1),
  ('سودان', 'Sudan', 'SD', 'SDN', NULL, 'Khartoum', NULL, NULL, 'SD', 2100, 1),
  ('سورینام', 'Suriname', 'SR', 'SUR', NULL, 'Paramaribo', NULL, NULL, 'SR', 2110, 1),
  ('سوالبارد و یان ماین', 'Svalbard and Jan Mayen', 'SJ', 'SJM', NULL, 'Longyearbyen', NULL, NULL, 'SJ', 2120, 1),
  ('اسواتینی', 'Swaziland', 'SZ', 'SWZ', NULL, 'Mbabane', NULL, NULL, 'SZ', 2130, 1),
  ('سوئد', 'Sweden', 'SE', 'SWE', NULL, 'Stockholm', NULL, NULL, 'SE', 2140, 1),
  ('سوئیس', 'Switzerland', 'CH', 'CHE', NULL, 'Berne', NULL, NULL, 'CH', 2150, 1),
  ('سوریه', 'Syria', 'SY', 'SYR', NULL, 'Damascus', NULL, NULL, 'SY', 2160, 1),
  ('تایوان', 'Taiwan', 'TW', 'TWN', NULL, 'Taipei', NULL, NULL, 'TW', 2170, 1),
  ('تاجیکستان', 'Tajikistan', 'TJ', 'TJK', NULL, 'Dushanbe', NULL, NULL, 'TJ', 2180, 1),
  ('تانزانیا', 'Tanzania', 'TZ', 'TZA', NULL, 'Dodoma', NULL, NULL, 'TZ', 2190, 1),
  ('تایلند', 'Thailand', 'TH', 'THA', NULL, 'Bangkok', NULL, NULL, 'TH', 2200, 1),
  ('تیمور-لسته', 'Timor-Leste', 'TL', 'TLS', NULL, 'Dili', NULL, NULL, 'TL', 2210, 1),
  ('توگو', 'Togo', 'TG', 'TGO', NULL, 'Lome', NULL, NULL, 'TG', 2220, 1),
  ('توکلائو', 'Tokelau', 'TK', 'TKL', NULL, NULL, NULL, NULL, 'TK', 2230, 1),
  ('تونگا', 'Tonga', 'TO', 'TON', NULL, 'Nuku''alofa', NULL, NULL, 'TO', 2240, 1),
  ('ترینیداد و توباگو', 'Trinidad and Tobago', 'TT', 'TTO', NULL, 'Port of Spain', NULL, NULL, 'TT', 2250, 1),
  ('تونس', 'Tunisia', 'TN', 'TUN', NULL, 'Tunis', NULL, NULL, 'TN', 2260, 1),
  ('ترکیه', 'Turkey', 'TR', 'TUR', NULL, 'Ankara', NULL, NULL, 'TR', 2270, 1),
  ('ترکمنستان', 'Turkmenistan', 'TM', 'TKM', NULL, 'Ashgabat', NULL, NULL, 'TM', 2280, 1),
  ('جزایر تورکس و کایکوس', 'Turks and Caicos Islands', 'TC', 'TCA', NULL, 'Cockburn Town', NULL, NULL, 'TC', 2290, 1),
  ('تووالو', 'Tuvalu', 'TV', 'TUV', NULL, 'Funafuti', NULL, NULL, 'TV', 2300, 1),
  ('جزایر ویرجین ایالات متحده', 'U.S. Virgin Islands', 'VI', 'VIR', NULL, 'Charlotte Amalie', NULL, NULL, 'VI', 2310, 1),
  ('اوگاندا', 'Uganda', 'UG', 'UGA', NULL, 'Kampala', NULL, NULL, 'UG', 2320, 1),
  ('اوکراین', 'Ukraine', 'UA', 'UKR', NULL, 'Kiev', NULL, NULL, 'UA', 2330, 1),
  ('امارات متحدهٔ عربی', 'United Arab Emirates', 'AE', 'ARE', NULL, 'Abu Dhabi', NULL, NULL, 'AE', 2340, 1),
  ('بریتانیا', 'United Kingdom', 'GB', 'GBR', NULL, 'London', NULL, NULL, 'GB', 2350, 1),
  ('ایالات متحده', 'United States', 'US', 'USA', NULL, 'Washington', NULL, NULL, 'US', 2360, 1),
  ('جزایر دورافتادهٔ ایالات متحده', 'United States Minor Outlying Islands', 'UM', 'UMI', NULL, NULL, NULL, NULL, 'UM', 2370, 1),
  ('اروگوئه', 'Uruguay', 'UY', 'URY', NULL, 'Montevideo', NULL, NULL, 'UY', 2380, 1),
  ('ازبکستان', 'Uzbekistan', 'UZ', 'UZB', NULL, 'Tashkent', NULL, NULL, 'UZ', 2390, 1),
  ('وانواتو', 'Vanuatu', 'VU', 'VUT', NULL, 'Port Vila', NULL, NULL, 'VU', 2400, 1),
  ('واتیکان', 'Vatican', 'VA', 'VAT', NULL, 'Vatican City', NULL, NULL, 'VA', 2410, 1),
  ('ونزوئلا', 'Venezuela', 'VE', 'VEN', NULL, 'Caracas', NULL, NULL, 'VE', 2420, 1),
  ('ویتنام', 'Vietnam', 'VN', 'VNM', NULL, 'Hanoi', NULL, NULL, 'VN', 2430, 1),
  ('والیس و فوتونا', 'Wallis and Futuna', 'WF', 'WLF', NULL, 'Mata Utu', NULL, NULL, 'WF', 2440, 1),
  ('صحرای غربی', 'Western Sahara', 'EH', 'ESH', NULL, 'El-Aaiun', NULL, NULL, 'EH', 2450, 1),
  ('یمن', 'Yemen', 'YE', 'YEM', NULL, 'Sanaa', NULL, NULL, 'YE', 2460, 1),
  ('زامبیا', 'Zambia', 'ZM', 'ZMB', NULL, 'Lusaka', NULL, NULL, 'ZM', 2470, 1),
  ('زیمبابوه', 'Zimbabwe', 'ZW', 'ZWE', NULL, 'Harare', NULL, NULL, 'ZW', 2480, 1)
ON DUPLICATE KEY UPDATE
  name_fa = VALUES(name_fa),
  name_en = VALUES(name_en),
  iso3 = VALUES(iso3),
  phone_code = VALUES(phone_code),
  capital = VALUES(capital),
  currency_code = VALUES(currency_code),
  timezone_default = VALUES(timezone_default),
  flag = VALUES(flag),
  sort_order = VALUES(sort_order),
  accuracy = VALUES(accuracy),
  modified_at = UTC_TIMESTAMP();

INSERT INTO cities (country_id, name_fa, name_en, timezone, is_trade_city, sort_order, accuracy, created_by)
SELECT c.id, city.name_fa, city.name_en, city.timezone, city.is_trade_city, city.sort_order, 1, 1
FROM countries c
JOIN (
  SELECT 'IR' AS iso2, 'تهران' AS name_fa, 'Tehran' AS name_en, 'Asia/Tehran' AS timezone, 1 AS is_trade_city, 10 AS sort_order
  UNION ALL SELECT 'AE', 'دبی', 'Dubai', 'Asia/Dubai', 1, 10
  UNION ALL SELECT 'AE', 'ابوظبی', 'Abu Dhabi', 'Asia/Dubai', 1, 20
  UNION ALL SELECT 'CN', 'شانگهای', 'Shanghai', 'Asia/Shanghai', 1, 10
  UNION ALL SELECT 'CN', 'پکن', 'Beijing', 'Asia/Shanghai', 1, 20
  UNION ALL SELECT 'CN', 'گوانگژو', 'Guangzhou', 'Asia/Shanghai', 1, 30
  UNION ALL SELECT 'CN', 'شنژن', 'Shenzhen', 'Asia/Shanghai', 1, 40
  UNION ALL SELECT 'CN', 'ییوو', 'Yiwu', 'Asia/Shanghai', 1, 50
  UNION ALL SELECT 'CN', 'نینگبو', 'Ningbo', 'Asia/Shanghai', 1, 60
  UNION ALL SELECT 'CN', 'چینگ‌دائو', 'Qingdao', 'Asia/Shanghai', 1, 70
  UNION ALL SELECT 'TR', 'استانبول', 'Istanbul', 'Europe/Istanbul', 1, 10
  UNION ALL SELECT 'TR', 'آنکارا', 'Ankara', 'Europe/Istanbul', 1, 20
  UNION ALL SELECT 'TR', 'مرسین', 'Mersin', 'Europe/Istanbul', 1, 30
  UNION ALL SELECT 'TR', 'ازمیر', 'Izmir', 'Europe/Istanbul', 1, 40
  UNION ALL SELECT 'IQ', 'بغداد', 'Baghdad', 'Asia/Baghdad', 1, 10
  UNION ALL SELECT 'IQ', 'بصره', 'Basra', 'Asia/Baghdad', 1, 20
  UNION ALL SELECT 'IQ', 'اربیل', 'Erbil', 'Asia/Baghdad', 1, 30
  UNION ALL SELECT 'RU', 'مسکو', 'Moscow', 'Europe/Moscow', 1, 10
  UNION ALL SELECT 'RU', 'سن‌پترزبورگ', 'Saint Petersburg', 'Europe/Moscow', 1, 20
  UNION ALL SELECT 'DE', 'فرانکفورت', 'Frankfurt', 'Europe/Berlin', 1, 10
  UNION ALL SELECT 'DE', 'هامبورگ', 'Hamburg', 'Europe/Berlin', 1, 20
  UNION ALL SELECT 'DE', 'برلین', 'Berlin', 'Europe/Berlin', 1, 30
  UNION ALL SELECT 'GB', 'لندن', 'London', 'Europe/London', 1, 10
  UNION ALL SELECT 'US', 'نیویورک', 'New York', 'America/New_York', 1, 10
  UNION ALL SELECT 'US', 'لس‌آنجلس', 'Los Angeles', 'America/Los_Angeles', 1, 20
  UNION ALL SELECT 'US', 'شیکاگو', 'Chicago', 'America/Chicago', 1, 30
) city ON city.iso2 = c.iso2
ON DUPLICATE KEY UPDATE
  name_fa = VALUES(name_fa),
  timezone = VALUES(timezone),
  is_trade_city = VALUES(is_trade_city),
  sort_order = VALUES(sort_order),
  accuracy = VALUES(accuracy),
  modified_at = UTC_TIMESTAMP();

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'خانه', '/', 'home', NULL, 1, 10, 'خوبروز | خدمات بازرگانی', 'صفحه اصلی خوبروز برای خدمات بازرگانی، واردات، صادرات و ترخیص کالا.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'home');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'خدمات', '/services', 'services', NULL, 1, 20, 'خدمات بازرگانی خوبروز', 'خدمات واردات، صادرات، ترخیص کالا، کارگو و حمل تجاری.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'services');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'مقالات', '/knowledge', 'knowledge', NULL, 1, 30, 'مقالات و دانش تجاری', 'مقالات آموزشی و کاربردی درباره تجارت بین‌المللی.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'knowledge');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'خبرها', '/news', 'news', NULL, 1, 40, 'خبرهای تجارت و بازار', 'خبرهای مرتبط با تجارت، بازار و بازرگانی خارجی.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'news');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'ترخیص کالا', '/services/customs-clearance', 'customs-clearance', (SELECT id FROM menus m WHERE m.slug = 'services' LIMIT 1), 2, 21, 'ترخیص کالا', 'بررسی مسیر ترخیص کالا، مدارک و پیگیری امور گمرکی.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'customs-clearance');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'حواله یوآن چین', '/services/yuan-transfer', 'yuan-transfer', (SELECT id FROM menus m WHERE m.slug = 'services' LIMIT 1), 2, 22, 'حواله یوآن چین | پرداخت RMB برای واردات', 'بررسی مسیر حواله یوآن چین برای خرید خارجی، پرداخت به تامین‌کننده و هماهنگی پرداخت‌های وارداتی.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'yuan-transfer');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'ثبت سفارش واردات', '/services', 'import-registration-menu', (SELECT id FROM menus m WHERE m.slug = 'services' LIMIT 1), 2, 23, 'ثبت سفارش واردات | پیش‌نیازها و مدارک', 'آشنایی با مسیر ثبت سفارش واردات، مدارک پایه و ارتباط آن با واردات رسمی و ترخیص کالا.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'import-registration-menu');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'واردات کالا', '/services', 'import-services-menu', (SELECT id FROM menus m WHERE m.slug = 'services' LIMIT 1), 2, 24, 'واردات کالا | مسیر بازرگانی و اسناد', 'بررسی مسیر واردات کالا از انتخاب تامین‌کننده تا حمل، اسناد، ثبت سفارش و ترخیص.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'import-services-menu');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'واردات از چین', '/services', 'china-import-menu', (SELECT id FROM menus m WHERE m.slug = 'services' LIMIT 1), 2, 25, 'واردات از چین | خرید، حمل و ترخیص', 'راهنمای مسیر واردات از چین شامل تامین‌کننده، خرید، پرداخت، حمل و آماده‌سازی ترخیص کالا.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'china-import-menu');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'کارگو چین', '/services', 'china-cargo-menu', (SELECT id FROM menus m WHERE m.slug = 'services' LIMIT 1), 2, 26, 'کارگو چین | حمل کالا از چین', 'بررسی مسیر کارگو چین، عوامل موثر بر هزینه حمل و ارتباط آن با اسناد و ترخیص کالا.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'china-cargo-menu');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'صادرات کالا', '/services', 'export-services-menu', (SELECT id FROM menus m WHERE m.slug = 'services' LIMIT 1), 2, 27, 'صادرات کالا | اسناد و مسیر فروش خارجی', 'مرور اسناد صادرات، آماده‌سازی کالا، مذاکره با خریدار و پیگیری مسیر صادرات.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'export-services-menu');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'فایل‌ها و اسناد', '/documents', 'documents', NULL, 1, 40, 'فایل‌ها و اسناد تجاری | نمونه سند واردات و صادرات', 'نمونه فایل‌ها، چک‌لیست‌ها و اسناد کاربردی برای واردات، صادرات و ترخیص کالا.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'documents');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'بازار', '/markets/currency-rates', 'markets', NULL, 1, 50, 'نرخ ارز و بازارهای تجاری | خوبروز', 'نمایش نرخ ارزهای مهم، طلا و شاخص‌های پرکاربرد برای رصد عمومی بازار تجارت.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'markets');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'قیمت ارزهای رایج', '/markets/currency-rates', 'currency-rates', (SELECT id FROM menus m WHERE m.slug = 'markets' LIMIT 1), 2, 51, 'قیمت ارزهای رایج تجارت | دلار، یورو و یوان', 'جدول نرخ ارزهای پرکاربرد تجارت خارجی برای رصد دلار، یورو، درهم، یوان و سایر نرخ‌های مهم.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'currency-rates');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'درباره خوبروز', '/about', 'about', NULL, 1, 60, 'درباره خوبروز | خدمات بازرگانی و آموزش تجارت', 'معرفی خوبروز، رویکرد خدمات بازرگانی، آموزش تجارت خارجی و مسیرهای ارتباطی.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'about');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'معرفی خوبروز', '/about', 'about-us', (SELECT id FROM menus m WHERE m.slug = 'about' LIMIT 1), 2, 61, 'معرفی خوبروز | رویکرد و ارزش‌ها', 'آشنایی با جایگاه برند خوبروز، تمرکز خدماتی و ارزش‌های محتوایی و بازرگانی.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'about-us');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'تماس با ما', '/contact', 'contact', (SELECT id FROM menus m WHERE m.slug = 'about' LIMIT 1), 2, 62, 'تماس با خوبروز | مشاوره بازرگانی و ترخیص', 'مسیر تماس با خوبروز برای مشاوره خدمات بازرگانی، واردات، صادرات، ترخیص کالا و حواله یوآن.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'contact');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'سوالات متداول', '/faq', 'faq', (SELECT id FROM menus m WHERE m.slug = 'about' LIMIT 1), 2, 63, 'سوالات متداول تجارت خارجی | خوبروز', 'پاسخ پرسش‌های رایج درباره واردات، صادرات، ترخیص کالا، کارگو چین و خدمات خوبروز.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'faq');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'آموزش صادرات و واردات', '/education', 'education', (SELECT id FROM menus m WHERE m.slug = 'knowledge' LIMIT 1), 2, 31, 'آموزش صادرات و واردات | مفاهیم و اسناد تجارت خارجی', 'آموزش مفاهیم پایه واردات، صادرات، ثبت سفارش، حمل، اسناد تجاری و ترخیص کالا.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'education');

INSERT INTO menus (title, url, slug, parent_id, level, sort_order, seo_title, seo_description, is_published, accuracy, created_by)
SELECT 'دانشنامه تجارت', '/knowledge', 'knowledge-base', (SELECT id FROM menus m WHERE m.slug = 'knowledge' LIMIT 1), 2, 32, 'دانشنامه تجارت خارجی | اصطلاحات واردات و گمرک', 'اصطلاحات کاربردی تجارت خارجی، گمرک، واردات، صادرات، پروفرما، پکینگ لیست و HS Code.', 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE slug = 'knowledge-base');

UPDATE menus
SET title='آموزش و دانشنامه', url='/knowledge', parent_id=NULL, level=1, sort_order=30, seo_title='آموزش و دانشنامه تجارت خارجی | خوبروز', seo_description='آموزش واردات و صادرات، دانشنامه تجارت خارجی، اصطلاحات گمرکی و محتوای کاربردی بازرگانی.', is_published=1, accuracy=1, modified_at=UTC_TIMESTAMP()
WHERE slug='knowledge';

UPDATE menus
SET parent_id=(SELECT id FROM (SELECT id FROM menus WHERE slug='knowledge' LIMIT 1) AS parent_menu), level=2, sort_order=33, title='بخشنامه‌ها و اخبار', url='/news', seo_title='بخشنامه‌ها و اخبار گمرکی | خوبروز', seo_description='اخبار و بخشنامه‌های مرتبط با واردات، صادرات، ثبت سفارش، گمرک و تجارت خارجی.', is_published=1, accuracy=1, modified_at=UTC_TIMESTAMP()
WHERE slug='news';

UPDATE menus
SET title='خانه', url='/', parent_id=NULL, level=1, sort_order=10, seo_title='خوبروز | خدمات بازرگانی، واردات و ترخیص کالا', seo_description='خوبروز برای خدمات بازرگانی، واردات، صادرات، ترخیص کالا، حواله یوآن و آموزش تجارت خارجی.', is_published=1, accuracy=1, modified_at=UTC_TIMESTAMP()
WHERE slug='home';

UPDATE menus
SET title='خدمات', url='/services', parent_id=NULL, level=1, sort_order=20, seo_title='خدمات بازرگانی خوبروز | واردات، صادرات، ترخیص و حواله یوآن', seo_description='خدمات خوبروز شامل ترخیص کالا، واردات از چین، کارگو، صادرات، ثبت سفارش و حواله یوآن چین است.', is_published=1, accuracy=1, modified_at=UTC_TIMESTAMP()
WHERE slug='services';

INSERT INTO tags (title, slug, accuracy, created_by) VALUES
  ('ترخیص کالا', 'customs-clearance', 1, 1),
  ('واردات', 'import', 1, 1),
  ('صادرات', 'export', 1, 1),
  ('حمل دریایی', 'sea-freight', 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title), accuracy = VALUES(accuracy), modified_at = UTC_TIMESTAMP();

INSERT INTO services (title, slug, short_title, summary, is_published, accuracy, created_by) VALUES
  ('ترخیص کالا', 'customs-clearance', 'بررسی ترخیص', 'بررسی مدارک، مسیر گمرکی و آماده‌سازی درخواست برای پیگیری اجرایی ترخیص کالا.', 1, 1, 1),
  ('ثبت سفارش واردات', 'import-registration', 'بررسی مسیر', 'مرور پیش‌نیازهای ثبت سفارش، مدارک پایه و ارتباط آن با واردات رسمی.', 1, 1, 1),
  ('واردات کالا', 'import-services', 'مشاهده خدمت', 'بررسی مسیر واردات از انتخاب کالا و تامین‌کننده تا حمل، اسناد و تحویل نهایی.', 1, 1, 1),
  ('واردات از چین', 'china-import', 'شروع بررسی', 'بررسی منبع‌یابی، خرید، حمل، کارگو و ملاحظات ورود کالا از چین به ایران.', 1, 1, 1),
  ('حواله یوآن چین', 'yuan-transfer', 'بررسی حواله', 'بررسی مسیر پرداخت یوآن چین برای سفارش‌های وارداتی، خرید از تامین‌کننده و هماهنگی پرداخت RMB.', 1, 1, 1),
  ('کارگو چین', 'china-cargo', 'جزئیات کارگو', 'توضیح مسیرهای کارگو، عوامل هزینه، ریسک‌ها و ارتباط آن با فرایند ترخیص.', 1, 1, 1),
  ('صادرات کالا', 'export-services', 'مسیر صادرات', 'مرور اسناد پایه صادرات، آماده‌سازی کالا، مذاکره و پیگیری مسیر فروش خارجی.', 1, 1, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  short_title = VALUES(short_title),
  summary = VALUES(summary),
  is_published = VALUES(is_published),
  accuracy = VALUES(accuracy),
  modified_at = UTC_TIMESTAMP();

INSERT INTO world_clock_items (country_id, city, country, country_code, timezone, market_label, flag, sort_order, is_published, accuracy, created_by)
SELECT c.id, 'تهران', 'ایران', 'IR', 'Asia/Tehran', 'دفتر مرکزی', 'IR', 10, 1, 1, 1
FROM countries c
WHERE c.iso2 = 'IR' AND NOT EXISTS (SELECT 1 FROM world_clock_items w WHERE w.timezone = 'Asia/Tehran' AND w.city = 'تهران');

INSERT INTO world_clock_items (country_id, city, country, country_code, timezone, market_label, flag, sort_order, is_published, accuracy, created_by)
SELECT c.id, 'دبی', 'امارات', 'AE', 'Asia/Dubai', 'حواله و واردات', 'AE', 20, 1, 1, 1
FROM countries c
WHERE c.iso2 = 'AE' AND NOT EXISTS (SELECT 1 FROM world_clock_items w WHERE w.timezone = 'Asia/Dubai' AND w.city = 'دبی');

INSERT INTO world_clock_items (country_id, city, country, country_code, timezone, market_label, flag, sort_order, is_published, accuracy, created_by)
SELECT c.id, 'شانگهای', 'چین', 'CN', 'Asia/Shanghai', 'سورسینگ و کارگو', 'CN', 30, 1, 1, 1
FROM countries c
WHERE c.iso2 = 'CN' AND NOT EXISTS (SELECT 1 FROM world_clock_items w WHERE w.timezone = 'Asia/Shanghai' AND w.city = 'شانگهای');

UPDATE world_clock_items
SET accuracy = 2, is_published = 0, modified_at = UTC_TIMESTAMP(), modified_by = 1
WHERE country_code = 'CN' AND city IN ('Beijing', 'پکن');

INSERT INTO world_clock_items (country_id, city, country, country_code, timezone, market_label, flag, sort_order, is_published, accuracy, created_by)
SELECT c.id, 'استانبول', 'ترکیه', 'TR', 'Europe/Istanbul', 'تجارت منطقه‌ای', 'TR', 40, 1, 1, 1
FROM countries c
WHERE c.iso2 = 'TR' AND NOT EXISTS (SELECT 1 FROM world_clock_items w WHERE w.timezone = 'Europe/Istanbul' AND w.city = 'استانبول');

INSERT INTO world_clock_items (country_id, city, country, country_code, timezone, market_label, flag, sort_order, is_published, accuracy, created_by)
SELECT c.id, 'بغداد', 'عراق', 'IQ', 'Asia/Baghdad', 'صادرات و منطقه', 'IQ', 50, 1, 1, 1
FROM countries c
WHERE c.iso2 = 'IQ' AND NOT EXISTS (SELECT 1 FROM world_clock_items w WHERE w.timezone = 'Asia/Baghdad' AND w.city = 'بغداد');

INSERT INTO world_clock_items (country_id, city, country, country_code, timezone, market_label, flag, sort_order, is_published, accuracy, created_by)
SELECT c.id, 'مسکو', 'روسیه', 'RU', 'Europe/Moscow', 'تجارت اوراسیا', 'RU', 55, 1, 1, 1
FROM countries c
WHERE c.iso2 = 'RU' AND NOT EXISTS (SELECT 1 FROM world_clock_items w WHERE w.timezone = 'Europe/Moscow' AND w.city = 'مسکو');

INSERT INTO world_clock_items (country_id, city, country, country_code, timezone, market_label, flag, sort_order, is_published, accuracy, created_by)
SELECT c.id, 'فرانکفورت', 'آلمان', 'DE', 'Europe/Berlin', 'اروپا و تجارت مالی', 'DE', 60, 1, 1, 1
FROM countries c
WHERE c.iso2 = 'DE' AND NOT EXISTS (SELECT 1 FROM world_clock_items w WHERE w.timezone = 'Europe/Berlin' AND w.city = 'فرانکفورت');

UPDATE world_clock_items
SET accuracy = 2, is_published = 0, modified_at = UTC_TIMESTAMP(), modified_by = 1
WHERE country_code = 'DE' AND city = 'هامبورگ';

UPDATE world_clock_items w
JOIN countries c ON c.id = w.country_id
JOIN cities ci ON ci.country_id = c.id AND ci.name_fa = w.city AND ci.accuracy = 1
SET w.city_id = ci.id,
    w.timezone = ci.timezone,
    w.modified_at = UTC_TIMESTAMP(),
    w.modified_by = 1
WHERE w.city_id IS NULL OR w.timezone <> ci.timezone;
