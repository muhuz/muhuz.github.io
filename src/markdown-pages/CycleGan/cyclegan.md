---
slug: "/blog/cyclegan"
date: "2020-09-23"
title: "Taking CycleGAN for a Ride"
blurb: "CycleGAN is a deep learning architecture that allows for unpaired image translation across two different domains. This post explores some of the details of CycleGAN 
and my implementation of the model for style transfer on land art from Magic: The Gathering and for unpaired image translation of images of bald people to images of not bald people."
tags: ["GAN", "Deep Learning"]
---

## Primer on GAN
---
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

The CycleGAN architecture detailed in the paper is applied onto image datasets and image problems. You can use GANs to generate fake examples in any data domain, from images to music to text.

## CycleGAN
---
CycleGAN was introduced in a paper by Zhu et al. titled "Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks". Before this paper, Pix2Pix showed great results learning associations between two domains of images when the training data is paired together. Paired data is often not available or requires a lot of manual work to label properly. CycleGAN is an approach to unpaired image translation using GANs. Instead of having a generator that maps from noise to a data distribution, we want to map data from one image domain $X$ to a different image domain $Y$. Instead of generating a fake image from random noise, the generator now aims to map a set of images in one domain to a set of images in another. For example, you could have a generator that takes a picture of a brown horse and returns a similar image of zebra. The zebra discriminator's job is to determine if a given image is a real zebra or a fake zebra.

CycleGAN uses two different GANs for the task of image translation. Now we have two generators, $G_X : X \rightarrow Y$ and $G_Y : Y \rightarrow X$ and two discriminators $D_Y$ that identifies images in the $Y$ domain and $D_X$ that identifies images in the $X$ domain.

In addition to adding another GAN, CycleGAN also changes the standard loss function by adding cycle loss and identity loss. These additional losses are added to impose more structure to the generators. Cycle loss imposes the constraint that we want $G_X \circ G_Y = I_X$ and $G_Y \circ G_X = I_Y$ where $I_X$ and $I_Y$ are the identity for data in the $X$ domain and $Y$ domain respectively. In other words, we want $G_Y(G_X(x)) = x$. This encourages the generators to not become permutation functions of the training data. This loss is given by
$$
L_{cyc}(G_X, G_Y) = \mathbb{E}_{x \sim p(X)}[\|G_Y(G_X(x)) - x\|_1] + \mathbb{E}_{y \sim p(Y)}[\|G_X(G_Y(y)) - y)\|_1]
$$

Identity loss imposes the constraint that if a generator is given an image in the domain it is mapping to, then the generator should return the same image, $G_X(y) = y$.
$$
L_{id}(G_X, G_Y) = \mathbb{E}_{x \sim p(X)}[\|G_Y(x) - x\|_1] + \mathbb{E}_{y \sim p(Y)}[\|G_X(y) - y)\|_1]
$$

In the paper, identity loss was used only for the task of translating paintings to photos. Also, they noted that there was no difference to their results when they defined the cycle loss and identity loss using L2 norm vs L1 norm.

The architecture of the generator and the discriminator are made up of several convolutional layers. The generator has several downsampling convolutional layers, into several Resnet blocks, into several transposed convolutions. The discriminator is made up of primarily downsampling convolutional layers. The final prediction of the discriminator network is not a scalar, but a 30 x 30 output (assuming input images of 256 x 256). This output is compared against a target of a 30 x 30 tensor of 1's or 0's. The intpretation of this 30 x 30 output is that each entry in this tensor represents the discriminator's prediction of whether a certain patch of the input image is real or fake. This type of discriminator is called PatchGAN since the output evalulates patches of the input. The authors of CycleGAN introduce PatchGAN is this **[paper](https://arxiv.org/abs/1611.07004v3)**.

### More on Transposed Convolutions

Transposed convolutions are layers that allow the model to upsample data from the previous later. This allows the generator to return an output of the same size as it's input after passing the input through multiple downsampling convolutional layers. 




## Training the Model
---
I tested CycleGAN on two applications listed in the paper, style transfer and unpaired image translation, but using different datasets. 

### Style Transfer on MTG Lands

For style transfer, I wanted to transfer a particular artists style onto art from Magic: The Gathering. In the CycleGAN paper, the authors implement style transfer using art by Claude Monet. Monet's body of work is a great way to test style transfer since he has a distinctive impressionist style of painting. I downloaded a 300 image dataset of Monet's works from **[Kaggle](https://www.kaggle.com/c/gan-getting-started/data)**. Here are some examples of Monet's art.

<div style="display: inline-flex; width: 100%;">
  <img src="images/4ab2583fe2.jpg">
  <img src="images/4ab2583fe2.jpg">
  <img src="images/4ab2583fe2.jpg">
</div>

![](images/4ab2583fe2.jpg) ![](images/2e0d0e6e19.jpg) ![](images/512cd171a9.jpg)


Magic: The Gathering is a card game with over 10,000 unique cards printed since the game's initial launch in 1993. The card game boasts a wide array of card art depicting all sorts of things from monsters to magical equipments to spells. Lands are another type of card in Magic: The Gathering and they commonly feature artwork of landscapes. This makes it a good application of style transfer for Monet's landscape art.



It took me around 16 hours to train the network for 200 epochs using training datasets containing 360 images of size 256 x 256 on a Nvidia RTX 2060 Super.

### Bald to Not Bald (RoGANe)

For unpaired image translation, I wanted to try something a bit more experimental. Many of the examples of unpaired image translation in the paper are on tasks that translate texture onto a given frame or shape (google maps and satellite image translation, UT Zappos50k edge and shoe translation, Yosemite summer and winter translation). I wanted to see how CycleGAN would for a task that required a more extreme translation. The task that I picked out was to see if CycleGAN could translate an image of a bald person to a person with hair and vice versa. **[Kaggle](https://www.kaggle.com/ashishjangra27/bald-classification-200k-images-celeba)** has an oddly specific dataset of over 200k images of bald and not bald people. Due to the limitations of my machine, that's way more data than I can use to train CycleGAN in a reasonable amount of time. I used a very small subset of the data, 150 images of bald people and 150 images of not bald people, to train the model.