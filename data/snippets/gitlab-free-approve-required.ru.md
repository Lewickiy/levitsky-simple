# Принудительное одобрение Merge Request в GitLab Free с использованием `.gitlab-ci.yml`

Прежде чем показать, как я реализовал проверку одобрения Merge Request (MR), хочу отметить, что это решение **не** существенно повышает безопасность слияния, так как все настройки CI остаются открыты для разработчиков.  
Таким образом, этот подход больше направлен на **осведомлённость** — напоминание разработчику, что одобрение требуется перед слиянием.

## 1. Создание Access Token
Перейдите в *Настройки* через меню пользователя.  
Зайдите в *Access tokens*.  
Добавьте единственное разрешение, доступное для этого токена: [✔] `read_api`

## 2. Добавление токена как переменной группы/проекта
Сгенерированный токен добавляется как переменная группы или проекта.  
В примере имя переменной `${GITLAB_TOKEN}`, хотя точное имя не критично.

**Важно!** Убедитесь, что переменная *защищена*, и скорее всего, она должна быть доступна только для защищённых веток.

Ниже пример простой реализации стадии `validate` в `gitlab-ci.yml`, которая проверяет статус одобрения.

## 3. `gitlab-ci.yml`

```yaml
stages:
  - validate

check_mr_approvals:
  stage: validate
  image: curlimages/curl:latest
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  script: |
    echo "CI_PIPELINE_SOURCE: $CI_PIPELINE_SOURCE"
    echo "CI_MERGE_REQUEST_IID: ${CI_MERGE_REQUEST_IID:-N/A}"
    echo "CI_PROJECT_ID: ${CI_PROJECT_ID:-N/A}"
    echo "GITLAB_TOKEN length: ${#GITLAB_TOKEN}"

    echo "Получаем информацию об одобрениях через GitLab API..."
    approvals_response=$(curl --silent --show-error --fail --location \
      --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
      "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/approvals")
    if [ $? -ne 0 ]; then
      echo "Ошибка при запросе API. Проверьте GITLAB_TOKEN и доступ к API."
      exit 1
    fi

    echo "Ответ API по одобрениям:"
    echo "$approvals_response"

    approved=$(echo "$approvals_response" | grep -o '"approved":\(true\|false\)' | grep -o 'true\|false')
    if [ -z "$approved" ]; then
      echo "Не удалось получить статус одобрения. Неожиданный формат ответа."
      exit 1
    fi

    if [ "$approved" != "true" ]; then
      echo "Merge Request не одобрен. Статус одобрения: $approved"
      exit 1
    fi

    echo "Merge Request одобрен — продолжаем."
  allow_failure: false
```
## 4. Какой JSON возвращает GitLab API?
Процесс выше получает следующий JSON от GitLab API:
```json
{
  "user_has_approved": true,
  "user_can_approve": false,
  "approved": true,
  "approved_by": [
    {
      "user": {
        "id": 1,
        "username": "username",
        "name": "Full name",
        "state": "active",
        "locked": false,
        "avatar_url": "https://gitlab.domainname.org/uploads/-/system/user/avatar/1/avatar.png",
        "web_url": "https://gitlab.domainname.org/levitsky"
      }
    }
  ]
}
```

Так как автор MR может сам иметь возможность одобрять свои изменения, рекомендую улучшить логику следующим образом:
- Читать массив approved_by
- Убедиться, что MR одобрили как минимум два разных пользователя
- Отмечать стадию как успешную только при выполнении этого условия

Удачи и спасибо за внимание!

*P.S. Если у вас есть более интересные или безопасные реализации этой функциональности, предлагайте улучшения к этому материалу.*