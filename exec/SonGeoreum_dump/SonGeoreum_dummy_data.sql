-- category 데이터 추가
INSERT INTO category(name, is_testable) VALUES('자음','T');
INSERT INTO category(name, is_testable) VALUES('모음','T');
INSERT INTO category(name, is_testable) VALUES('숫자','T');
INSERT INTO category(name, is_testable) VALUES('회화','F');
INSERT INTO category(name, is_testable) VALUES('관계','F');
INSERT INTO category(name, is_testable) VALUES('감정표현','F');

-- word 데이터 추가
-- 자음
INSERT INTO word(name, content_url, category_id) VALUES('ㄱ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221635952_OWXO8MQ23.jpg/m51_7_i1.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㄴ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221636105_WJKK5JTII.jpg/m51_7_i2.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㄷ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221636373_0VMU2KKIF.jpg/m51_7_i3.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㄹ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221638192_JHSG7B2L6.jpg/m51_7_i4.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅁ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221639489_8BTLK23Y7.jpg/m51_7_i5.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅂ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221640121_ASIC21XWI.jpg/m51_7_i6.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅅ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221640600_W3BQ4FGD7.jpg/m51_7_i7.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅇ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221641186_QDL66NEJB.jpg/m51_7_i8.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅈ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221641379_6S8VOSLRZ.jpg/m51_7_i9.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅊ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221643700_53FDKED97.jpg/m51_7_i10.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅋ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221643905_4AHTZD8JZ.jpg/m51_7_i11.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅌ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221644122_3ZJFUHDPC.jpg/m51_7_i12.jpg?type=w130_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅍ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221644369_70KY0RZYV.jpg/m51_7_i13.jpg?type=w165_fst&wm=N',1);
INSERT INTO word(name, content_url, category_id) VALUES('ㅎ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221646332_O0VBMPYFL.jpg/m51_7_i14.jpg?type=w165_fst&wm=N',1);

-- 모음
INSERT INTO word(name, content_url, category_id) VALUES('ㅏ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221647198_5A7G7UIPQ.jpg/m51_7_i15.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅑ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221647449_7ERG0BSDO.jpg/m51_7_i16.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅓ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221648243_SK8OOJRTH.jpg/m51_7_i17.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅕ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221648948_WT6S9UR2G.jpg/m51_7_i18.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅗ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221649036_EBUFMI6ME.jpg/m51_7_i19.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅛ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221650787_6RO5YG2SY.jpg/m51_7_i20.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅜ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221650866_JAWFLSHIN.jpg/m51_7_i21.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅠ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221650925_5FC94QFJP.jpg/m51_7_i22.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅡ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221651116_AR40ZMFUD.jpg/m51_7_i23.jpg?type=w130_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅣ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221653281_6TXVS3W9H.jpg/m51_7_i24.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅐ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221653890_9F2FOG6R4.jpg/m51_7_i25.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅒ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221654159_CIOOEFKM0.jpg/m51_7_i26.jpg?type=w165_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅔ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221655307_HWM8GIKQU.jpg/m51_7_i27.jpg?type=w130_fst&wm=N',2);
INSERT INTO word(name, content_url, category_id) VALUES('ㅖ','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221655476_AKZBG8CDX.jpg/m51_7_i28.jpg?type=w130_fst&wm=N',2);

-- 숫자
INSERT INTO word(name, content_url, category_id) VALUES('0','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221655909_3VYQ8KWZG.jpg/m51_7_i29.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('1','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657469_CBQSOA6GI.jpg/m51_7_i30.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('2','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657647_9TQ6Z0TU7.jpg/m51_7_i31.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('3','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657842_3KSB8I7QK.jpg/m51_7_i32.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('4','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657899_G7GWVCY34.jpg/m51_7_i33.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('5','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221700423_AKR6SWZQ5.jpg/m51_7_i34.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('6','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221700705_SMUBJ90BZ.jpg/m51_7_i35.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('7','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221701068_24THQP0GN.jpg/m51_7_i36.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('8','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221702406_JQ0NTF3PQ.jpg/m51_7_i37.jpg?type=w130_fst&wm=N',3);
INSERT INTO word(name, content_url, category_id) VALUES('9','https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221702754_KFPI17OTD.jpg/m51_7_i38.jpg?type=w130_fst&wm=N',3);

-- 회화
INSERT INTO word(name, content_url, category_id) VALUES('안녕하세요','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624421/MOV000244910_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('감사합니다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/632085/MOV000243986_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('죄송하다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191022/630183/MOV000253802_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('안녕히 계세요','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624422/MOV000246604_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('오랜만','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20190918/615385/MOV000245472_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('만나다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191029/632284/MOV000252208_700X466.mp4 ',4);
INSERT INTO word(name, content_url, category_id) VALUES('어떻게','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200820/732339/MOV000257357_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('도움','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191010/626234/MOV000236648_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('아니다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191101/633271/MOV000260442_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('하지 마','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/631969/MOV000246778_700X466.mp4',4);
INSERT INTO word(name, content_url, category_id) VALUES('맞다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/631894/MOV000241295_700X466.mp4',4);

-- 관계
INSERT INTO word(name, content_url, category_id) VALUES('엄마','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624374/MOV000238631_700X466.mp4',5);
INSERT INTO word(name, content_url, category_id) VALUES('아빠','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624399/MOV000239769_700X466.mp4',5);
INSERT INTO word(name, content_url, category_id) VALUES('친구','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191015/627705/MOV000257451_700X466.mp4',5);
INSERT INTO word(name, content_url, category_id) VALUES('절친하다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733298/MOV000258060_700X466.mp4',5);
INSERT INTO word(name, content_url, category_id) VALUES('우정','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191024/630493/MOV000255166_700X466.mp4',5);
INSERT INTO word(name, content_url, category_id) VALUES('같이','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191001/623710/MOV000240291_700X466.mp4',5);
INSERT INTO word(name, content_url, category_id) VALUES('따로','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191028/631887/MOV000240345_700X466.mp4',5);
INSERT INTO word(name, content_url, category_id) VALUES('선생','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191029/632450/MOV000245908_700X466.mp4',5);

-- 감정표현
INSERT INTO word(name, content_url, category_id) VALUES('좋다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191022/629987/MOV000259382_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('행복','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191025/630748/MOV000237400_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('슬픔','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191016/628058/MOV000239357_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('걱정','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191007/625140/MOV000249112_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('배고프다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191017/628480/MOV000254728_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('졸리다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200824/735073/MOV000259232_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('무섭다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191025/630992/MOV000252416_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('그립다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191007/625117/MOV000249030_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('궁금하다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624431/MOV000248626_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('신기하다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191025/630946/MOV000245688_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('맛있다','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191014/627269/MOV000252525_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('괜찮다','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191022/630119/MOV000249438_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('사랑','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191021/629620/MOV000253928_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('농담','https://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191011/626645/MOV000252448_700X466.mp4',6);
INSERT INTO word(name, content_url, category_id) VALUES('가능','http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/732879/MOV000249484_700X466.mp4',6);