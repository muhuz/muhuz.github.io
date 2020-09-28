---
slug: "/blog/cyclegan"
date: "2020-09-23"
title: "Taking CycleGAN for a Ride"
blurb: "CycleGAN is a deep learning architecture that allows for unpaired image translation across two different domains. This post explores some of the details of CycleGAN 
and my implementation of the model for style transfer on land art from Magic: The Gathering and for unpaired image translation of images of bald people to images of not bald people."
tags: ["GAN", "Deep Learning"]
---

## Primer on GAN

A **General Adversarial Network (GAN)** is comprised of two models, a generator and a discriminator. Given a set of data, the generator network
attempts to generate samples that would come from the same distribution as the data while the discriminator network attempts to distinguish between 
whether or not a given data point is from the distribution of the data or a fake created by the generator. In some sense, the models are "competeing" against each other during the training process. During training, the generator produces better fakes while the discriminator becomes more precise in identifying the fake from the real. This can be seen in the typical objective function for GAN. Given a generator, $G: Z \rightarrow X$ that maps from samples of gaussian noise to the output space of the real data, and a discriminator $D: X \rightarrow [0, 1]$ the objective function is

$$
L_{GAN}(G, D, X, Z) = \mathbb{E}_{x \sim p(X)}[log(D(x))] + \mathbb{E}_{z \sim p(Z)}[1-log(D(G(z)))]
$$ 

The goal is to minimize this loss over all possible $G$ and maximize this loss over all possible $D$.
$$
\min_{G}\max_{D} L_{GAN}(G, D, X, Z)
$$

You can use GAN to generate data from many different domains from music to images. 

## CycleGAN

For unpaired image translation, instead of having a generator that maps from noise to a data distribution, we want to map data from one domain $X$ to a different domain $Y$. Instead of generating a fake image from random noise, the generator now aims to map a set of images in one domain to a set of images in another. For example, you could have a generator that takes a picture of a brown horse and returns a similar image of zebra. The zebra discriminator's job is to determine if a given image is a real zebra or a fake zebra.

CycleGAN uses two different GANs for the task of image translation. Now we have two generators, $G_X : X \rightarrow Y$ and $G_Y : Y \rightarrow X$ and two discriminators $D_Y$ that identifies images in the $Y$ domain and $D_X$ that identifies images in the $X$ domain.

In addition to adding another GAN, CycleGAN also changes the standard loss function by adding cycle loss and identity loss. These additional losses are added to impose more structure to the generators. 

Cycle loss imposes the constraint that we want $G_X \circ G_Y = I_X$ and $G_Y \circ G_X = I_Y$ where $I_X$ and $I_Y$ are the identity for data in the $X$ domain and $Y$ domain respectively. In other words, we want $G_Y(G_X(x)) = x$. This encourages the generators to not become permutation functions of the training data. This loss is given by
$$
L_{cyc}(G_X, G_Y) = \mathbb{E}_{x \sim p(X)}[\|G_Y(G_X(x)) - x\|_1] + \mathbb{E}_{y \sim p(Y)}[\|G_X(G_Y(y)) - y)\|_1]
$$

Identity loss imposes the constraint that if a generator is given an image in the domain it is mapping to, then the generator should return the same image, $G_X(y) = y$.
$$
L_{id}(G_X, G_Y) = \mathbb{E}_{x \sim p(X)}[\|G_Y(x) - x\|_1] + \mathbb{E}_{y \sim p(Y)}[\|G_X(y) - y)\|_1]
$$

In the paper, identity loss was used only for the task of translating paintings to photos. Also, they noted that there was no difference to their results when they defined the cycle loss and identity loss using L2 norm vs L1 norm.

The architecture of the generator and the discriminator are made up of several convolutional layers. The generator has several downsampling convolutional layers, into several Resnet blocks, into several transposed convolutions. The discriminator is made up of primarily downsampling convolutional layers. 

## Training the Model

With two GAN's in one model, CycleGAN does take up a lot of memory on the GPU. With PyTorch 1.6's introduction of  