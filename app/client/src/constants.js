angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'PandaHack 2018',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'Вы должны были получить электронное письмо с просьбой подтвердить Вашу электронную почту. Нажмите ссылку в письме, и Вы сможете начать свою регистрацию! ',
        INCOMPLETE_TITLE: 'Вам по-прежнему нужно заполнить заявку!',
        INCOMPLETE: 'Если Вы не закончите регистрацию до [APP_DEADLINE], то мы не сможем одобрить Вашу заявку!',
        SUBMITTED_TITLE: 'Заявка отправлена!',
        SUBMITTED: 'Не стесняйтесь редактировать заявку в любое время. Однако, как только регистрация будет закрыта, Вы не сможете ее больше редактировать.\nПожалуйста, убедитесь, что ваша информация верна, прежде чем регистрация будет закрыта!',
        CLOSED_AND_INCOMPLETE_TITLE: 'К сожалению, регистрация закрыта. ',
        CLOSED_AND_INCOMPLETE: 'Так как Вы не заполнили свою анкету вовремя, Вы не будете допущены к хакатону.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'Вы должны подтвердить своё участие до [CONFIRM_DEADLINE].',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Время подтверждения участия [CONFIRM_DEADLINE] прошло.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Несмотря на то, что Вы были приняты, Вы не подтвердили своё участие вовремя \n К сожалению, это означает, что Вы не сможете принять участие в мероприятии, так как мы должны начать принимать других претендентов в списке ожидания \nМы надеемся увидеть Вас в другой раз!',
        CONFIRMED_NOT_PAST_TITLE: 'Вы можете изменить решение об участии до [CONFIRM_DEADLINE]',
        DECLINED: 'Мы сожалеем, что Вы не сможете попасть на PandaHack 2018! :(\nМы надеемся, что увидимся в другой раз.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'К сожалению, уже поздно регистрироваться с командой.\nТем не менее, Вы по-прежнему можете формировать команду самостоятельно или во время мероприятия!',
    });
