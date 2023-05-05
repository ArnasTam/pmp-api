import ChallengesController from '@controllers/challenges.controller';
import { CreateChallengeDto } from '@dtos/challanges/create_challange.dto';
import { UpdateChallengeDto } from '@dtos/challanges/update_challenge.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class ChallengesRoute implements Routes {
  public basePath = '/challenges';
  public router = Router();
  public challengesController = new ChallengesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.basePath}`, authMiddleware, this.challengesController.getChallenges);
    this.router.get(`${this.basePath}/:id`, authMiddleware, this.challengesController.getChallengeById);
    this.router.post(`${this.basePath}`, authMiddleware, validationMiddleware(CreateChallengeDto, 'body'), this.challengesController.createChallenge);
    this.router.put(
      `${this.basePath}/:id`,
      authMiddleware,
      validationMiddleware(UpdateChallengeDto, 'body'),
      this.challengesController.updateChallenge,
    );
    this.router.delete(`${this.basePath}/:id`, authMiddleware, this.challengesController.deleteChallenge);
  }
}

export default ChallengesRoute;
