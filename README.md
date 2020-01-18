# Задание 3

> Пожалуйста, опишите в коде или в файле README ход ваших мыслей: какие ошибки и как вы нашли, почему они возникли, как их можно исправить.

## Ход мыслей и ошибки

→ Попробовала запустить расширение, как это описано в задании. Оно не запустилось, а а редактор отобразил ошибки во вкладке Problems.

  * `src/server.ts 82:41` - ошибка при попытке доступа к несуществующему свойству. Исправила, посмотрев на интерфейс `jsonToAst.AstProperty`.
  * `src/server.ts 23:19` - ошибка в передаваемом параметре для функции `conn.onInitialize`. Чтобы исправить, понадобилось посмотреть, что представляет собой объект `conn` и какие параметры на вход принимает функция onInitialize. Затем просто добавила недостающие параметры и импортировала недостающие типы.

→ Расширение запустилось, но превью отобразило мне `{{content}}`, будто где-то допущена ошибка в шаблонизаторе. Пришло время изучить структуру проекта и обозначить для себя, что где находится, а заодно найти что-то вроде шаблонов.

→ В ходе осмотра наткнулась на файл `preview/index.html`, где неверно был прописан путь до файла стилей. _Чувствую себя детективом._

→ Но проблему это не исправило, я даже перезапустила тестовый редактор. Попробую поискать, где используется `preview/index.html`.

→ Нигде. Пойду почитаю файл `src/server.ts`.

→ Что-то я в тупике, подозреваю, что не правильно пофиксила вторую проблему. Попробую подебажить.

→ А, все-таки `preview/index.html` используется.

→ Кажется, я начала понимать, как это работает. Походила дебагом и нашла место, где с помощью JS функции `replace` должен вставляться контент. Но функция, видимо, не находит совпадений по регулярному выражению.

→ Так и есть. Если считать регулярное выражение верным, то места, обозначенные для вставки контента, обязательно должны быть отделены хотя бы одним пробелом от фигурных скобок с каждой стороны. На мой взгляд, это условие совершенно излишне, так что я меняю `+` на `*`.

→ Ура, я продвинулась дальше! Но на превью все еще ничего нет. Попробую вставить стили с помощью тега style, вдруг дело в неправильном пути к стилям.

→ Нет, дело не в этом.

→ Как глупо.. прям перед носом этот селектор `.div`, хотя конечно же нет никакого класса div. Исправила на селектор по тегу.

→ Зато теперь точно проблема в пути к стилям. Либо проект настроен так, что доступа к файлу `preview/style.css` просто нет, либо просто сам путь неверный.

→ Устав пробовать самые разнообразные способы подключить файл стилей, я пошла читать, как делаются расширения для VSCode в целом и как, в частности, можно подключить CSS для webview. Я нашла в документации подходящий [способ](https://code.visualstudio.com/api/extension-guides/webview#content-security-policy), но на практике он, увы, не сработал. Поэтому, мне пришлось прибегнуть к не самому изящному, зато 100% рабочему варианту - я вставила CSS инлайн. Не вручную, конечно, а примерно также, как это было сделано с HTML. Наконец, расширение генерирует разметку из подаваемого на вход BEM JSON-а и отображает превью с минимальными стилями.
