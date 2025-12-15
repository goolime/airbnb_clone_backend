import { makeId } from "./utils.js";
import fs from 'fs';
import { dbService } from "./db.service.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const USER_COLLECTION = 'airbnb_users'
const PROPERTY_COLLECTION = 'airbnb_properties'
const ORDER_COLLECTION = 'airbnb_orders'
const REVIEW_COLLECTION = 'airbnb_reviews'

const NUM_OF_PROPERTIES = 40

const users = [
    {...getEmptyUser('Alice Johnson','https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg', 'alicej',[])},
    {...getEmptyUser('Bob Smith','https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg', 'bobsmith',[])},
    {...getEmptyUser('Charlie Brown','https://marszalstudio.pl/wp-content/uploads/2024/01/fajne-zdjecia-profilowe-19.webp', 'charlieb',[])},
    {...getEmptyUser('Diana Prince','https://cf.ltkcdn.net/www/images/std-xs/349429-340x340-woman-1437816897.jpg', 'dianap',[])},
    {...getEmptyUser('Ethan Hunt','https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg', 'ethanh',[])},
    {...getEmptyUser('Fiona Gallagher','https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg', 'fionag',[])},
    {...getEmptyUser('George Martin','https://res.cloudinary.com/dsd1isfdb/image/upload/v1640367093/picofme/examples/example_1_xixqoj.jpg', 'georgem',[])},
    {...getEmptyUser('Hannah Lee','https://storage.pixteller.com/designs/designs-images/2019-01-10/07/profile-phote-avatar-human-girl-yellow-fashion-1-5c3784f592e84.png', 'hannahl',[])},
    {...getEmptyUser('Ian Somerhalder','https://media.istockphoto.com/id/1285124274/photo/middle-age-man-portrait.jpg?s=612x612&w=0&k=20&c=D14m64UChVZyRhAr6MJW3guo7MKQbKvgNVdKmsgQ_1g=', 'ians',[])},
    {...getEmptyUser('Kevin Spacey','https://shotkit.com/wp-content/uploads/2021/06/Cool-profile-picture-Zoom.jpg', 'kevins',[])},
    {...getEmptyUser('Julia Roberts','https://shotkit.com/wp-content/uploads/bb-plugin/cache/cool-profile-pic-matheus-ferrero-landscape-6cbeea07ce870fc53bedd94909941a4b-zybravgx2q47.jpeg', 'juliar',[])},
    {...getEmptyUser('Laura Palmer','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 'laurap',[])},
    {...getEmptyUser('Michael Scott','https://img.freepik.com/free-photo/close-up-upset-american-black-person_23-2148749582.jpg?semt=ais_hybrid&w=740&q=80', 'michaels',[])},
    {...getEmptyUser('Nina Dobrev','https://images.unsplash.com/photo-1619895862022-09114b41f16f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29tZW4lMjBwcm9maWxlfGVufDB8fDB8fHww', 'ninad',[])},
    {...getEmptyUser('Oscar Isaac','https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', 'oscari',[])},
    {...getEmptyUser('Pam Beesly','https://www.heysaturday.co/wp-content/uploads/2016/11/best-dating-profile-photos-women-b.jpg', 'pamb',[])},
    {...getEmptyUser('Quentin Tarantino','https://img.freepik.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129416.jpg?semt=ais_hybrid&w=740&q=80', 'quentint',[])},
    {...getEmptyUser('Rachel Green','https://c.stocksy.com/a/P5eA00/z9/2537375.jpg', 'rachelg',[])},
    {...getEmptyUser('Steve Rogers','https://www.catholicsingles.com/wp-content/uploads/2020/06/blog-header-3.png', 'stever',[])},
    {...getEmptyUser('Tina Fey','https://wallpapers.com/images/hd/indian-woman-profile-in-colorful-top-0putj2ni5kvq074b.jpg', 'tinaf',[])},
    {...getEmptyUser('Uma Thurman','https://blog.photofeeler.com/wp-content/uploads/2016/06/good-dating-app-selfie-woman.jpeg', 'umat',[])},
    {...getEmptyUser('Victor Stone','https://wallpapers.com/images/featured/professional-profile-pictures-q8qf2vwd4sdzwlz5.jpg', 'victors',[])},
    {...getEmptyUser('Wendy Darling','https://media.allure.com/photos/618153bc590337268c4b06fd/16:9/w_2560%2Cc_limit/My%2520Beautiful%2520Black%2520Hair%25201.jpg', 'wendyd',[])},
    {...getEmptyUser('Xander Cage','https://img.freepik.com/premium-photo/confident-handsome-unshaven-guy-male-casual-fashion-mens-beauty-profile-man-with-bristle-red-shirt-young-man-with-beard-yellow-background-hair-beard-care_474717-145511.jpg?semt=ais_hybrid&w=740&q=80', 'xanderc',[])},
    {...getEmptyUser('Yara Shahidi','https://buffer.com/resources/content/images/2022/03/sigmund-MQ2xYBHImKM-unsplash--1--1.jpg', 'yaras',[])},
    {...getEmptyUser('Zoe Saldana','https://sarahclaysocial.com/wp-content/uploads/2020/10/sarah-clay-3.jpg', 'zoes',[])},
    {...getEmptyUser('Aaron Paul','https://www.shutterstock.com/image-photo/smiling-african-american-millennial-businessman-600nw-1437938108.jpg', 'aaronp',[])},
    {...getEmptyUser('Betty Cooper','https://images.unsplash.com/photo-1464863979621-258859e62245?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmVtYWxlJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D', 'bettyc',[])},
    {...getEmptyUser('Carl Grimes','https://media.istockphoto.com/id/597958694/photo/young-adult-male-student-in-the-lobby-of-a-university.jpg?s=612x612&w=0&k=20&c=QaNEzmcKrLJzmwOcu2lgwm1B7rm3Ouq2McYYdmoMGpU=', 'carlg',[])},
    {...getEmptyUser('Donna Paulsen','https://imgcdn.stablediffusionweb.com/2024/6/12/4d688bcf-f53b-42b6-a98d-3254619f3b58.jpg', 'donnap',[])},
    {...getEmptyUser('Elliot Alderson','https://media.istockphoto.com/id/1187099771/photo/closeup-of-businessman-walking-on-street.jpg?s=612x612&w=0&k=20&c=HtazzqVW8omUAGT6SCq2l3YxOh0IWUyVB2r2SnAS-xQ=', 'elliota',[])},
    {...getEmptyUser('Felicity Smoak','https://wallpapers.com/images/hd/women-profile-pictures-1600-x-1068-fxwo58jy7eguhon3.jpg', 'felicitys',[])},
    {...getEmptyUser('Gordon Freeman','https://i.pinimg.com/474x/98/51/1e/98511ee98a1930b8938e42caf0904d2d.jpg', 'gordonf',[])},
    {...getEmptyUser('Harley Quinn','https://images.pexels.com/photos/160519/girl-beauty-beautiful-great-160519.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 'harleyq',[])},
    {...getEmptyUser('Isaac Clarke','https://images.unsplash.com/photo-1654110455429-cf322b40a906?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuJTIwcHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D', 'isaacc',[])},
    {...getEmptyUser('Jesse Pinkman','https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', 'jessep',[])},
    {...getEmptyUser('Kara Danvers','https://londonspeakerbureau.com/wp-content/uploads/2017/04/Steph-McGovern-Keynote-Speaker00002.jpg', 'karad',[])},
    {...getEmptyUser('Leonard Hofstadter','https://media.istockphoto.com/id/1394637422/photo/confident-handsome-30s-caucasian-millennial-man-businessman.jpg?s=612x612&w=0&k=20&c=yAaiBJ7NNX1dC2XE-HZecZkUF62f-J-ypKiIT_xn7eA=', 'leonardh',[])},
    {...getEmptyUser('Monica Geller','https://www.wsb.com/wp-content/uploads/2023/09/Bishop_Julie_ORIGINAL-682x749.jpg?bust=196e9025ff99ee354b3e6ce73549d7d2', 'monicag',[])},
    {...getEmptyUser('Nathan Drake','https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww', 'nathand',[])},
    {...getEmptyUser('Olivia Pope','https://www.wsb.com/wp-content/uploads/2025/09/Beadle_Michelle_ORIGINAL-682x830.jpg?bust=2751cc4acf3f0fd023eca98f5f05265b', 'oliviap',[])},
    {...getEmptyUser('Peter Parker','https://st.depositphotos.com/1008939/1316/i/450/depositphotos_13163725-stock-photo-young-man.jpg', 'peterp',[])},
    {...getEmptyUser('Quinn Fabray','https://a.storyblok.com/f/191576/1176x882/9bdc5d8400/round_profile_picture_hero_before.webp', 'quinnf',[])},
    {...getEmptyUser('Rick Grimes','https://images.unsplash.com/photo-1695927621677-ec96e048dce2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww', 'rickg',[])},
    {...getEmptyUser('Samantha Carter','https://datingmansecrets.com/wp-content/smush-webp/2025/04/Write-Short-Effective-Dating-Profile-Bios-7-Great-Examples-Woman.jpg.webp', 'samanthac',[])},
    {...getEmptyUser('Tommy Shelby','https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D', 'tommys',[])},
    {...getEmptyUser('Ursula Buffay','https://www.wsb.com/wp-content/uploads/2025/02/Raimondo_Gina_ORIGINAL.jpg-682x830.jpeg?bust=e7e06ba57e56cb5481e6cf8565243462', 'ursulab',[])},
    {...getEmptyUser('Vince Gilligan','https://ca-times.brightspotcdn.com/dims4/default/07e3d71/2147483647/strip/true/crop/2048x1466+0+0/resize/1200x859!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Ffc%2F0c%2F12a3c358a6aa2e4379b305b68450%2Flat-breakinglast-la0011558220-20130429', 'vinceg',[])},
    {...getEmptyUser('Wanda Maximoff','https://i.pinimg.com/736x/00/10/04/0010044438f9ab663ea6b265f1319b5e.jpg', 'wandam',[])},
    {...getEmptyUser('Xena Warrior','https://www.womansworld.com/wp-content/uploads/2025/04/MicrosoftTeams-image-16.jpg?quality=86&strip=all', 'xenaw',[])},
]

const demoPropertiesPictures = [
    'https://st.hzcdn.com/simgs/97910d6b0407c3d1_14-0485/_.jpg',
    'https://www.marthastewart.com/thmb/lxfu2-95SWCS0jwciHs1mkbsGUM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/modern-living-rooms-wb-1-bc45b0dc70e541f0ba40364ae6bd8421.jpg',
    'https://www.marthastewart.com/thmb/JSJwSMsolMumuoCAHHIjICbzYgs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/BradRamseyInteriors_credit_CarolineSharpnack-dee35c1fab554898af7c549697c2f592.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOUTnj8To32CSO4Ea4_ZhHkz4JSHOaqGORPg&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGmkx2Umg4LvSkn2y12K_ClQgk6W_F02SzhA&s',
    'https://cdn.mos.cms.futurecdn.net/rmUuWniHKpPEUMi6n7P8Ra.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/at%2Fstyle%2F2023-09%2Fliving-room-decor-ideas%2Fpattern-play',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLL24UVBb5PlHH3IfwtNIxXrqXl9hH_DHgRg&s',
    'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_2560,h_1598/https://www.essentialhome.eu/inspirations/wp-content/uploads/2024/11/32-Elegant-Living-Rooms-That-Showcase-the-Art-of-Luxury_21-min-scaled.jpg',
    'https://cdn.mos.cms.futurecdn.net/FjF4p3nsgJPamTvvYRna84.jpg',
    'https://media.designcafe.com/wp-content/uploads/2020/03/21012613/luxury-living-room-designs.jpg',
    'https://cdn.mos.cms.futurecdn.net/H73mVvQQs96oPvDTPPWTTY.jpg',
    'https://cdn.decorilla.com/online-decorating/wp-content/uploads/2023/10/Living-room-decor-trends-2024.jpg?width=900',
    'https://i.ytimg.com/vi/WpT-Lp_HaH4/maxresdefault.jpg',
    'https://i.ytimg.com/vi/RfYc0BUqkMs/maxresdefault.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/apartment-living-room-design-ideas-hbx040122nextwave-013-1656022467.jpg?crop=1.00xw:0.747xh;0,0.200xh&resize=1200:*',
    'https://www.thespruce.com/thmb/8O_XGPj2llBN0TGCXtFz5GUrytM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/rsw984h656-d6d00a18536d4afc8b48c0da03702ea7.jpeg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWo0aS9TAekC52w9HOswNpPX1tWd-Oo0z4Ew&s',
    'https://www.familyhandyman.com/wp-content/uploads/2023/02/neutral-design-small-apartment-via-instagram-e1677523038814.jpg?fit=700%2C700',
    'https://media.designcafe.com/wp-content/uploads/2020/02/21010329/modern-living-room-design-ideas.jpg',
    'https://www.thespruce.com/thmb/-QgLBTD5X5b-VmmUPyTyZUS99r0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/9H4A5504copy-4e4e05eda0e74a50a2846d3ac5d9127c.jpg',
    'https://www.luxurychicagoapartments.com/wp-content/uploads/2023/03/Seven-10-West-2-Bedroom-06.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvCRg9I-ka9v9ZeE9wAxApn7YC2SY7XK8nAg&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfrZSUKXq694ka-j6dGqnkvRmplC_jpuxVLw&s',
    'https://stylebyemilyhenderson.com/wp-content/uploads/2020/10/IMG_6041-3.jpg',
    'https://cdn.decoist.com/wp-content/uploads/2020/04/Separate-bedroom-in-the-one-bedroom-apartment-gives-you-ample-privacy-84410.jpg',
    'https://d28pk2nlhhgcne.cloudfront.net/assets/app/uploads/sites/3/2023/03/2-bedroom-apartment-floor-plans-1-1-1.png',
    'https://cdn.apartmenttherapy.info/image/upload/v1725034090/at/house%20tours/2024/august/emmy-p/tours-losangeles-emmy-p-02.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZp_u152bOPvJUhl8NLlalfpGSNDxngp5SoA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaAvDwM6MCgs_rm6b0GAxfXtrQN7Eo9tMJGQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmXeWRUy5n8bXxlUfvxESGOMm2NqlDq-ahbw&s',
    'https://livingsuites.com/wp-content/uploads/2020/06/1.-Three-Bedroom-Apartment-door-connecting-1.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1691674550/at/house%20tours/2023-House-Tours/2023-August/jhenene-l/tours-nyc-jhenene-l-03.jpg',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/363133922.jpg?k=5057b2e4a16c00914d884d3c71d3302a9fe75c77c7e7d04b232671efba1a2229&o=&hp=1',
    'https://www.redfin.com/blog/wp-content/uploads/2022/10/item_3-2.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLgZqjl8Vy-ZgnPE-tmeyfQRzgagexIMJ4fQ&s',
    'https://2024-rd-staging.nyc3.cdn.digitaloceanspaces.com/2024-prepare-for-canada/2024/11/16162323/Why-a-2-bedroom-apartment-Featured-Image.png',
    'https://tlv2go.com/wp-content/uploads/2020/10/%D7%97%D7%93%D7%A8-%D7%A9%D7%99%D7%A0%D7%94-e1618399252707.jpg',
    'https://lh7-rt.googleusercontent.com/docsz/AD_4nXf4-uB-n3bdTT9beBkzWqPxBtdnhauSPeibtDWMt8sTn-XhtO6ZRydComDg6MJnN_DT3kh84VJOb2yGNWJXPi26m5k41wIypXZ4si4-eZar3g5Jr6lf7pQztqgHwr_T60CYveulTEIiZmzFqqtrHcPZR4kP?key=SFAp1cLSLLhyyupiKp5-Cg',
    'https://cdn.decoist.com/wp-content/uploads/2020/04/Classic-Studio-Apartment-in-Manhattan-where-the-bedroom-becomes-a-part-of-the-living-space-95615.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/1737-q54a-jm-0403-lowres-designer-jennifer-mcgee-67dc655a1d1ac.jpg',
    'https://thelondonbathco.co.uk/wp-content/uploads/2021/07/iStock-1285717693-1920x1280.jpg',
    'https://getcanopy.co/cdn/shop/articles/pexels-christa-grover-977018-1910472_a6eacbcd-2d05-4163-aea7-af448d9d7a95.jpg?v=1732249806',
    'https://i.pinimg.com/736x/0d/8d/45/0d8d451ef2f2eecf040b38049febdf27.jpg',
    'https://bendmagazine.com/wp-content/uploads/2022/04/light-turquoise-spa-like-bathroom-Analicia-Herrmann.jpg',
    'https://cdn.mos.cms.futurecdn.net/jTf2tgYVw54nc4PEvjBVtT.jpg',
    'https://www.freestandingbath.co.uk/wp-content/uploads/2025/02/luxury-bathroom-featured.jpg',
    'https://imgix.cosentino.com/en-ie/wp-content/uploads/2025/02/Cosentino_Booth_KBIS_2025_15.jpg?auto=format%2Ccompress&ixlib=php-3.3.0',
    'https://bathtrendsusa.com/cdn/shop/files/24.jpg?v=1721336556&width=2800',
    'https://www.bellabathrooms.co.uk/blog/wp-content/uploads/2020/09/iStock-1158066696-1.jpg',
    'https://www.bellabathrooms.co.uk/blog/wp-content/uploads/2020/09/iStock-1158066696-1.jpg',
    'https://adamsez.com/wp-content/uploads/2024/10/home_2.jpg',
    'https://images.unsplash.com/photo-1696987007764-7f8b85dd3033?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwYmF0aHJvb218ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000',
    'https://duravitprod-media.e-spirit.cloud/75e15e67-f417-4084-8696-5e4151ad35b8/images/Planung-Inspiration/Magazin/6-Schritte-zum-Traumbad/whitetulip_culture_01_2_1.jpg',
    'https://www.thespruce.com/thmb/J53yaSLGsDzkOOTYiXuP52oMJ8I=/2048x0/filters:no_upscale():max_bytes(150000):strip_icc()/modern-bathroom-design-ideas-4129371-hero-723611e159bb4a518fc4253b9175eba8.jpg',
    'https://img.freepik.com/free-photo/modern-bathroom-with-bathtub-double-sink-vanity-smart-home-technology_9975-33078.jpg?semt=ais_hybrid&w=740&q=80',
    'https://ahouseinthehills.com/wp-content/uploads/2023/11/Efficiency-Meets-Style-Modern-Bathroom-Products-for-Contemporary-Homes-scaled.jpeg',
    'https://showroom.coburns.com/wp-content/uploads/2022/01/sidekix-media-g51F6-WYzyU-unsplash.jpg',
    'https://img.staticmb.com/mbcontent/images/crop/uploads/2022/11/Balcony-decor-lights_0_1200.jpg.webp',
    'https://res.cloudinary.com/dw4e01qx8/f_auto,q_auto/images/m8jt2phsv9gjety3w1ub',
    'https://media.designcafe.com/wp-content/uploads/2020/08/29114351/options-for-seating-in-balcony-interior-design.jpg',
    'https://media.admiddleeast.com/photos/6682dcd29964267a3a5503f7/master/w_1600%2Cc_limit/By%2520Michael%2520Stavaridis.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcz8c7qM15x4nMub-Ehlc40-QB1XKAWpe09Q&s',
    'https://media.designcafe.com/wp-content/uploads/2020/02/21004553/balcony-furniture-ideas.jpg',
    'https://thearchitectsdiary.com/wp-content/uploads/2024/04/Types-of-balcony-9-1024x667.webp',
    'https://cdn.aarp.net/content/dam/aarp/home-and-family/your-home/2021/02/1140-woman-balcony.jpg',
    'https://assets.architecturaldigest.in/photos/62e1222e9e358822d96a421b/master/pass/5%20balcony%20design%20ideas%20to%20create%20a%20cozy%20outdoor%20space%20during%20the%20monsoon.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKXmS87gQXYZkoiqDZlIhUhKYMwTbl5zUtzA&s',
    'https://my-geranium.com/wp-content/uploads/sites/2/2025/03/2025-Geranien-5000-Frohliches-Leben-im-Freien-06.jpg',
    'https://contemporarystructures.co.uk/wp-content/uploads/2023/11/lumon-balcony-glazing-roof-1280x914-1.webp',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaGEcoKYhNbENZ6Vk4iL-G_Y_MrGM9wXRxpA&s',
    'https://cdn.mos.cms.futurecdn.net/SBEc9byj6fg7aaGVfiKuqf.jpg',
    'https://foyr.com/learn/wp-content/uploads/2019/03/balcony-design-ideas-scaled-1200x675.jpg',
    'https://cdn.mos.cms.futurecdn.net/bJauktLkEuUrjXXKNUaPAh.jpg',
    'https://blog.displate.com/wp-content/uploads/2022/09/Balcony-Ideas_23.jpg',
    'https://www.thespruce.com/thmb/pxHUZL7HME0HMU2h0l57g8OFGHk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JessBungeforEHDtinybalcony-58af2c107b074437bd0bf0993fb43187.jpeg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyncK8nofaQGyKEFPKqd-SSpoUyeyOjTY2XA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYgbAhD_fGrR7jA1pEXjYyQAZh5x_qC07qgg&s',
    'https://api.photon.aremedia.net.au/wp-content/uploads/sites/2/2018/01/small-balcony-ideas.jpg?fit=1920%2C1080',
    'https://media.designcafe.com/wp-content/uploads/2023/07/05145205/balcony-storage-solutions.jpg'
]

const nameParts=['Sunset','Pines', 'Rout 9', 'Pinecrest', 'Highway', "Traveler's", "Evergreen", 'Stop',
                 'Desert', 'Palms', 'Stopover', 'Coastline', 'Moonlight', 'Crossroads', 'Road', 'Blubird',
                 'Orchard', 'Trail', 'Valley', 'View', 'Lakeside', 'Golden', 'Harbor', 'Starlit', 'House',
                 'Summit', 'Inn', 'Park', 'North', 'West', 'East', 'South', 'Ember', 'Lodge', 'Grove']

const amenities=['TV', 'Wifi', 'Kitchen', 'Smoking allowed', 'Pets allowed', 'Cooking basics', 'A/C', 'Pool', 'Hot tub',
                 'Free Parking', 'Washer', 'Dryer', 'Heating', 'Workspace', 'Hairdryer','Iron', 'EV charger', 'Crib', 
                 'King bed','Breakfast','Gym', 'Grill', 'Indoor fireplace', 'Beachfront', 'Waterfront', 'Smoke alarm', 'Carbon monoxide alarm',
                 'Self check-in','free cancellation',]

const propertyType=['House', 'Apartment', 'Guesthouse', 'Hotel']

const accessibility=['Step-free access', 'Disabled parking', 'Wide entrance', 'Step-free bedroom', 'Wide bedroom enterance',
                     'Step-free bathroom', 'Wide bathroom enterance', 'Toilet grab bar', 'Shower grab bar', 'Step-free shower',
                     'bath chair', 'Ceilling or mobile host']

const reviews=['Very helpful hosts. Cooked traditional meals for us and gave great tips about the area.',
               'Amazing location and stunning views! The apartment was clean and well-equipped.',
               'Had a wonderful stay! The host was very accommodating and the place felt like home.',
               'Beautiful property with great amenities. Would definitely recommend to others!',
               'The house was spacious and comfortable. Perfect for our family vacation.',
               'Fantastic experience from start to finish. The host went above and beyond to ensure we had a great stay.',
               'Lovely decor and a cozy atmosphere. The balcony had the best views of the city.',
               'Great value for the price. The location was convenient and the neighborhood was safe.',
               'The kitchen had everything we needed to cook our own meals. Made our stay even better!',
               'Highly recommend this place! The host was responsive and provided excellent recommendations for local attractions.',
               "Room was dirty on arrival — stained sheets and a mildew smell in the bathroom. Staff took forever to respond.",
               "Photos are misleading. The place is tiny, the bed is lumpy, and the HVAC rattled all night.",
               "Check-in was a mess and the host was rude. Hidden cleaning fees added at checkout.",
               "Host cancelled our stay last minute and offered a refund — left us scrambling for alternatives.",
               "Good location but poor upkeep: broken shower head, flickering lights, and a loose door latch.",
               "Overpriced for what you get. Minimal supplies, no toiletries, and the Wi-Fi didn't work.",
               "Thin walls — neighbors were loud until the early morning and management never intervened.",
               "Safety concerns: exterior lighting was out and the deadbolt was loose. I didn't feel secure."
]

const citys=[{ countryCode: 'US', city: 'New York', minLat: 40.4774, maxLat: 40.9176, minLng: -74.2591, maxLng: -73.7004 },
             { countryCode: 'FR', city: 'Paris', minLat: 48.8156, maxLat: 48.9022, minLng: 2.2241, maxLng: 2.4699 },
             { countryCode: 'JP', city: 'Tokyo', minLat: 35.5285, maxLat: 35.8395, minLng: 139.6100, maxLng: 139.9100 },
             { countryCode: 'AU', city: 'Sydney', minLat: -34.1183, maxLat: -33.5781, minLng: 150.5209, maxLng: 151.3430 },
             { countryCode: 'BR', city: 'Rio de Janeiro', minLat: -23.0827, maxLat: -22.7468, minLng: -43.7955, maxLng: -43.0900 },
             { countryCode: 'ZA', city: 'Cape Town', minLat: -34.2580, maxLat: -33.7900, minLng: 18.3554, maxLng: 18.7034 },
             { countryCode: 'IT', city: 'Rome', minLat: 41.7690, maxLat: 42.0092, minLng: 12.3959, maxLng: 12.8555 },
             { countryCode: 'CA', city: 'Toronto', minLat: 43.5810, maxLat: 43.8555, minLng: -79.6393, maxLng: -79.1152 },
             { countryCode: 'IN', city: 'Mumbai', minLat: 18.8920, maxLat: 19.2710, minLng: 72.7754, maxLng: 72.9860 },
             { countryCode: 'GB', city: 'London', minLat: 51.2868, maxLat: 51.6919, minLng: -0.5103, maxLng: 0.3340 },
             { countryCode: 'DE', city: 'Berlin', minLat: 52.3383, maxLat: 52.6755, minLng: 13.0884, maxLng: 13.7611 },
             { countryCode: 'ES', city: 'Barcelona', minLat: 41.3200, maxLat: 41.4690, minLng: 2.0520, maxLng: 2.2280 },
             { countryCode: 'NL', city: 'Amsterdam', minLat: 52.3396, maxLat: 52.5000, minLng: 4.8342, maxLng: 5.1000 },
             { countryCode: 'MX', city: 'Mexico City', minLat: 19.2041, maxLat: 19.5926, minLng: -99.3633, maxLng: -99.0421 },
             { countryCode: 'RU', city: 'Moscow', minLat: 55.4500, maxLat: 55.9500, minLng: 37.3000, maxLng: 37.8000 },
             { countryCode: 'KR', city: 'Seoul', minLat: 37.4133, maxLat: 37.7151, minLng: 126.7341, maxLng: 127.1022 },
             { countryCode: 'ISR', city: 'Tel Aviv', minLat: 32.0150, maxLat: 32.1500, minLng: 34.7500, maxLng: 34.9000 },
             { countryCode: 'TR', city: 'Istanbul', minLat: 40.8500, maxLat: 41.2000, minLng: 28.7000, maxLng: 29.3000 },
             { countryCode: 'SE', city: 'Stockholm', minLat: 59.2000, maxLat: 59.4500, minLng: 17.8000, maxLng: 18.2000 },
             { countryCode: 'CH', city: 'Zurich', minLat: 47.3200, maxLat: 47.4500, minLng: 8.4500, maxLng: 8.6500 }
            ]

function getSublist(list, size){
    const arr=[]
    for(let i=0;i<size;i++){
        const idx = Math.floor(Math.random()*list.length)
        arr.push(list[idx])
    }

    return arr
}

export function getPictures(num=5){
    return getSublist(demoPropertiesPictures, num)
}

function getName(){
    const arr=getSublist(nameParts, 2)
    return `${arr[0]} ${arr[1]}`
}

function getAmenities(num=8){
    return getSublist(amenities, num)
}

function getAccessibility(num=3){
    return getSublist(accessibility, num)
}

function getPropertyType(){
    const idx = Math.floor(Math.random()*propertyType.length)
    return propertyType[idx]
}

async function getHost(){
    const usersCollection = await dbService.getCollection(USER_COLLECTION);
    const randomUser = await usersCollection.aggregate([
      { $sample: { size: 1 } }
    ]).toArray();
    return randomUser[0]._id
}

function getLoc(loc){
    const lat = Math.random() * (loc.maxLat - loc.minLat) + loc.minLat
    const lng = Math.random() * (loc.maxLng - loc.minLng) + loc.minLng
    return { country: loc.country || 'Country', countryCode: loc.countryCode || 'CC', city: loc.city || 'City', address: `${Math.floor(Math.random()*100)} Random St`, lat,  lng}
}

async function getReview(propertyId){
    const review={
			property: ObjectId.createFromHexString(propertyId.toString()),
			txt: reviews[Math.floor(Math.random()*reviews.length)],
			rate: Math.floor(Math.random()*5+1),
			by: await getHost(),
		}
    const reviewsCollection = await dbService.getCollection(REVIEW_COLLECTION);
    const res = await reviewsCollection.insertOne(review)
    const reviewId = res.insertedId
}

async function getReviews(num=10,propertyId){
    //const arr = []
    for(let i=0;i<num;i++){
        await getReview(propertyId)
    }
    //return arr
}

async function getDemoProperty(loc = { countryCode: '', city: '', maxLat: 90, minLat: -90, maxLng: 180, minLng: -180}){
    return { ...getEmptyProperty(
        getName(),
        getPropertyType(),
        getPictures(),
        parseFloat((Math.random()*300+50).toFixed(1)), //price
        'Fantastic duplex apartment...',
        {adults: Math.floor(Math.random()*5+1), children: Math.floor(Math.random()*4), infants: Math.floor(Math.random()*2),pets: Math.floor(Math.random()*2)},
        getAmenities(),
        getAccessibility(),
        Math.floor(Math.random()*3+1), //bathrooms
        Math.floor(Math.random()*6+1), //beds
        Math.floor(Math.random()*5+1), //bedrooms
        [], //rules
        [], //labels
        await getHost(),
        getLoc(loc),
       //await getReviews(Math.floor(Math.random()*12+3))
    )}
}


async function setDemoData() {
    const usersCollection = await dbService.getCollection(USER_COLLECTION);
    const propertiesCollection = await dbService.getCollection(PROPERTY_COLLECTION);
    const ordersCollection = await dbService.getCollection(ORDER_COLLECTION);
    const reviewsCollection = await dbService.getCollection(REVIEW_COLLECTION);

    await usersCollection.deleteMany({})
    await propertiesCollection.deleteMany({})
    await ordersCollection.deleteMany({})
    await reviewsCollection.deleteMany({})

    console.log('Inserting demo users...')
    await usersCollection.insertMany(await Promise.all(users.map(async user=>({ ...user, password: await bcrypt.hash('password123', 10)}))))
    console.log('Inserting demo users completed.')

    console.log('Inserting demo properties...')
    for(let i=0;i<citys.length;i++){
        console.log(`Generating properties for ${citys[i].city}...`)
        for(let j=0;j<NUM_OF_PROPERTIES;j++){
            const loc = citys[i]
            const dp= await getDemoProperty(loc)
            const id = (await propertiesCollection.insertOne(dp)).insertedId
            getReviews(Math.floor(Math.random()*12+3),id)
            const hostId = dp.host
            const host = await usersCollection.findOne({_id: hostId})
            await usersCollection.updateOne({_id: hostId}, {$set: {properties: host.properties}})
        }
    }
    console.log('Inserting demo properties completed.')

    console.log('Inserting demo orders...')
    console.log()
    for(let i=0;i<await propertiesCollection.countDocuments();i++){
        const property = await propertiesCollection.find().limit(1).skip(i).next()
        const orderCount = Math.floor(Math.random()*40)
        var lastCheckOut = Date.now() - (1000*60*60*24*90) //90 days ago
        for(let j=0;j<orderCount;j++){
            const checkInDate = lastCheckOut + 1000*60*60*24*Math.floor(Math.random()*14) //within 180 days
            const stayLength = Math.floor(Math.random()*14+1) //1-14 days
            const checkOutDate = checkInDate + (1000*60*60*24*stayLength)
            lastCheckOut = checkOutDate
            const order={
                propertyId: property._id,
                guest: await getHost(),
                checkIn: new Date(checkInDate),
                checkOut: new Date(checkOutDate),
                guests: { adults: Math.floor(Math.random()*5+1), kids: Math.floor(Math.random()*4), infants: Math.floor(Math.random()*2), pets: Math.floor(Math.random()*2) },
                totalPrice: stayLength * property.price
            }
            await ordersCollection.insertOne(order)
        }
    }
    console.log('Inserting demo orders completed.')
}

function getEmptyProperty( name = '', 
                           type= null,
                           imgUrls= [], 
                           price = 0, 
                           summary= '', 
                           capacity= {adults:1,kids:0,infants:0,pets:0},
                           amenities= [],
                           accessibility= [],
                           bathrooms= 1,
                           bedrooms= 1,
                           beds= 1,
                           rules= [],
                           labels= [],
                           host= undefined,
                           loc= {country: null, countryCode: null, city: null, address: null, lat: 0, lng: 0},
                           reviews= []) {
    return { name,
             type,
             imgUrls,
             price,
             summary,
             capacity,
             amenities,
             accessibility,
             bathrooms,
             bedrooms,
             beds,
             rules,
             labels,
             host,
             loc,
             reviews
         }
}

function getEmptyUser(fullname = '', imgUrl = '', username = '', whishlist = []) {
    return { fullname, imgUrl, username, whishlist }
}

export async function validateDATA() {
    const usersCollection = await dbService.getCollection(USER_COLLECTION);
    const propertiesCollection = await dbService.getCollection(PROPERTY_COLLECTION);
    const ordersCollection = await dbService.getCollection(ORDER_COLLECTION);
    
    console.log('Validating demo data...')
    const usersCount = await usersCollection.count()
    const propertiesCount = await propertiesCollection.count()
    const ordersCount = await ordersCollection.count()

    if (usersCount === 0 || propertiesCount === 0 || ordersCount === 0) {
        console.log('Demo data not found, generating...')
        await setDemoData()
        console.log('Demo data generated.')
    }
    console.log('Demo data validation complete.')
}

