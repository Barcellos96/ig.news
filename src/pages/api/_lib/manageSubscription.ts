import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';


export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false,
) {    // Buscar usuário no banco do fauna com o ID {customerID} =stripe_customer_id ---- para isso devo criar um indice (index) no fauna
    // salvar os dados da subscription no faunaDB
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    if (createAction) {
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscription}
            )
        )
    } else {
        await fauna.query(
            q.Replace( //updated atualiza apenas 1 dado, replace substitui a subscription por completo
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscriptions_by_id'),
                            subscriptionId,
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }
}