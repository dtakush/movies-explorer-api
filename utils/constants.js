const errorMessages = {
  noUrl: 'Такого адреса не существует',
  unauthorized: 'В доступе на страницу отказано',
  incorrectFilmInfo: 'Переданы некорректные данные фильма',
  incorrectFilmId: 'Фильм с указанным Id не найден',
  noRightsToDelete: 'У вас нет прав на удаление',
  noUserId: 'Пользователя с таким Id не существует',
  incorrectUserInfo: 'Переданы некорректные данные при обновлении профиля',
  existingEmail: 'При регистрации указан email, который уже существует',
  incorrectLogin: 'Неверный логин либо пароль',
  successfulLogin: 'Успешная авторизация',
  tooManyRequests: 'Слишком много запросов подряд',
};

module.exports = errorMessages;
