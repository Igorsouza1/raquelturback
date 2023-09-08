import { randomUUID } from 'node:crypto'

export class DatabaseUser {
    #users = new Map()


    list(){
        return Array.from(this.#users.entries()).map((userArray) => {
            const id = userArray[0]
            const data = userArray[1]

            return {
                id,
                ...data
            }
        })
    }

    create(user){
        const userId = randomUUID()

        this.#users.set(userId, user)
    }

    update(id, user){
        this.#users.set(id, user)
    }

    emailExists(email) {
        for (let user of this.#users.values()) {
            if (user.email === email) {
                return true;
            }
        }
        return false;
    }

    cpfExists(cpf) {
        for (let user of this.#users.values()) {
            if (user.cpf === cpf) {
                return true;
            }
        }
        return false;
    }

    findByEmail(email) {
        for (let [id, user] of this.#users.entries()) {
            if (user.email === email) {
                return {
                    id,
                    ...user
                };
            }
        }
        return null; // Retorna null se o usuário não for encontrado
    }
}