# 사무실 주변 맛집 정보 공유 및 리뷰 사이트 - 백엔드

이 레포지토리는 사무실 주변 맛집 정보 공유 및 리뷰 사이트의 백엔드 프로젝트입니다. Django와 django-ninja를 사용하여 구현되었습니다.

## 시작하기

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### 사전 요구 사항

- Python 3.9 이상이 필요합니다.

### 설치 및 설정

1. 레포지토리를 클론하세요.

```bash
git clone https://github.com/univerSpace2/Woo-chelin-guide-be.git
cd Woo-chelin-guide-be
```
2. 가상 환경을 생성하고 활성화하세요.

```bash
python3 -m venv venv
source venv/bin/activate
```
3. 필요한 패키지를 설치하세요.

```bash
pip install -r requirements.txt
```
4. 환경 변수를 설정하세요 (예: .env 파일 생성).

```bash
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://user:password@localhost/dbname
```
5. 데이터베이스 마이그레이션을 실행하세요.

```bash
python manage.py migrate
```
6. 개발 서버를 실행하세요.
```bash
python manage.py runserver
```
이제 개발 서버가 http://127.0.0.1:8000/에서 실행됩니다.

## 기능
- 맛집 정보 조회
- 맛집 리뷰 작성 및 조회
- 맛집 추천 기능

## 사용된 기술
- Django
- django-ninja
- psycopg2
- django-cors-headers
- django-environ
