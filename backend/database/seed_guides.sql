-- guides.json-с бүх хөтөчдийг database руу оруулах

-- Эхлээд одоо байгаа guide-уудыг устгах (давхардахгүйн тулд)
DELETE FROM guides;

-- Бүх хөтөчдийг нэмэх
INSERT INTO guides (guideId, lastName, firstName, phone, email, area, category, languages, experienceLevel, profileImgUrl) VALUES
('g1', 'Бат', 'Энх', '99112233', 'enkh.bat@example.com', 'Төв', 'Байгаль', 'Монгол,Англи', '1 - 5 жил', '/assets/images/guide-img/guide1.svg'),
('g2', 'Дорж', 'Саруул', '88112233', 'sar.dorj@example.com', 'Төв', 'Соёл', 'Монгол', '1 жил ба түүнээс доош', '/assets/images/guide-img/guide2.svg'),
('g3', 'Сүрэн', 'Одмаа', '99117788', 'odmaa.suren@example.com', 'Хангай', 'Байгаль', 'Монгол,Орос', '5 -аас дээш жил', '/assets/images/guide-img/guide3.svg'),
('g4', 'Наран', 'Хульжиг', '95112233', 'nar.kh@example.com', 'Хангай', 'Адал явдалт', 'Монгол', '1 - 5 жил', '/assets/images/guide-img/guide4.svg'),
('g5', 'Эрдэнэ', 'Соёлмаа', '90123456', 'soyol.erd@example.com', 'Говь', 'Байгаль', 'Монгол,Англи', '5 -аас дээш жил', '/assets/images/guide-img/guide1.svg'),
('g6', 'Мөнх', 'Тулга', '99120011', 'tulga.munkh@example.com', 'Алтай', 'Ууланд гарах', 'Монгол,Орос', '1 - 5 жил', '/assets/images/guide-img/guide2.svg'),
('g7', 'Оюун', 'Сарнаа', '88002233', 'sar.oyun@example.com', 'Хангай', 'Соёл', 'Монгол', '1 - 5 жил', '/assets/images/guide-img/guide2.svg'),
('g8', 'Болд', 'Тэмүүлэн', '99001122', 'temu.bold@example.com', 'Зүүн', 'Соёл', 'Монгол', '1 жил ба түүнээс доош', '/assets/images/guide-img/guide2.svg'),
('g9', 'Саруул', 'Хонгор', '99119900', 'hongor.sar@example.com', 'Говь', 'Байгаль', 'Монгол', '1 - 5 жил', '/assets/images/guide-img/guide3.svg'),
('g10', 'Хишиг', 'Номин', '98112233', 'nom.khishig@example.com', 'Баруун', 'Амралт сувилал', 'Монгол,Англи', '5 -аас дээш жил', '/assets/images/guide-img/guide4.svg'),
('g33', 'Ананда', 'Эрдэнэбулган', '99820735', 'anandaebu5@gmail.com', 'Төв', 'Байгаль', 'Англи', '1 жил ба түүнээс доош', NULL),
('g34', 'ana', 'ebu', '99820735', 'anandaebu5@gmail.com', 'Төв', 'Байгаль', 'Япон', '1 - 5 жил', NULL),
('g13', 'Нансалмаа', 'Болд', '99835274', 'nansalmaaka@gmail.com', 'Зүүн', 'Адал явдалт', 'Орос', '1 жил ба түүнээс доош', '/assets/images/guide-img/guide_1767328094375_guide4.svg'),
('g14', 'Готов', 'Пунцаг', '97968756', 'gotom@gmail.com', 'Зүүн', 'Адал явдалт', 'Япон', '1 жил ба түүнээс доош', '/assets/images/guide-img/guide_1767327803272_guide1.svg'),
('g15', 'Марал', 'Баатар', '77677879', 'maral@gmail.com', 'Зүүн', 'Адал явдалт', 'Хятад', '1 жил ба түүнээс доош', '/assets/images/guide-img/guide_1767328307131_guide2.svg');
