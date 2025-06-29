import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

/**
 * Сервис для работы с сессиями
 */
@Injectable()
export class SessionService {
  public constructor(private readonly configService: ConfigService) {}

  /**
   * Метод для создания сессии
   * @param req - объект запроса express
   * @param userId - идентификатор пользователя
   * @throws InternalServerErrorException - если возникла проблема при сохранении сессии
   */
  public async saveSession(req: Request, userId: string) {
    return new Promise<void>((resolve, reject) => {
      req.session.userId = userId;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.',
            ),
          );
        }

        resolve();
      });
    });
  }

  /**
   * Метод для удаления сессии
   * @param req - объект запроса express
   * @param res - объект ответа express
   * @throws InternalServerErrorException - если возникла проблема при удалении сессии
   */
  public async clearSession(req: Request, res: Response) {
    return new Promise<void>((resolve, reject) => {
      if (!req.session) {
        return resolve();
      }

      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось удалить сессию. Попробуйте позже.',
            ),
          );
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }
}
